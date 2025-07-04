import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { supabaseAdmin } from "@/lib/supabase/server"
import { processCompanyFile } from "@/lib/utils/file-processor"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    console.log(`Starting bulk upload of ${files.length} files`)

    interface SuccessResult {
      success: true
      fileName: string
      companyName: string
      slug: string
      totalQuestions: number
      blobUrl: string
    }

    interface FailureResult {
      success: false
      fileName: string
      error: string
    }

    interface UploadResult {
      successful: SuccessResult[]
      failed: FailureResult[]
      total: number
    }

    const results: UploadResult = {
      successful: [],
      failed: [],
      total: files.length,
    }

    // Process files in batches to avoid overwhelming the system
    const batchSize = 5 // Process 5 files at a time
    const batches = []
    for (let i = 0; i < files.length; i += batchSize) {
      batches.push(files.slice(i, i + batchSize))
    }

    console.log(`Processing ${batches.length} batches of ${batchSize} files each`)

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      console.log(`Processing batch ${batchIndex + 1}/${batches.length}`)

      // Process batch in parallel
      const batchPromises = batch.map(async (file): Promise<SuccessResult | FailureResult> => {
        try {
          return await processSingleFile(file)
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error)
          return {
            success: false,
            fileName: file.name,
            error: error instanceof Error ? error.message : "Unknown error",
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)

      // Categorize results
      batchResults.forEach((result) => {
        if (result.success) {
          results.successful.push(result)
        } else {
          results.failed.push(result)
        }
      })

      // Small delay between batches to avoid rate limiting
      if (batchIndex < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    console.log(`Bulk upload completed: ${results.successful.length} successful, ${results.failed.length} failed`)

    return NextResponse.json({
      success: true,
      message: `Bulk upload completed: ${results.successful.length}/${results.total} files processed successfully`,
      results,
    })
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process bulk upload",
      },
      { status: 500 },
    )
  }
}

async function processSingleFile(file: File): Promise<{
  success: true
  fileName: string
  companyName: string
  slug: string
  totalQuestions: number
  blobUrl: string
}> {
  // Extract just the filename without path and extension
  const fileName = file.name.split("/").pop() || file.name // Remove path if present
  const baseFileName = fileName.replace(/\.csv$/i, "") // Remove .csv extension

  // Extract company name from filename
  const companyName = baseFileName
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" ")

  // Generate slug from base filename
  const slug = baseFileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  console.log(`Processing: ${companyName} (${slug}) from file: ${file.name}`)

  // Upload to Vercel Blob
  const blob = await put(`companies/${slug}.csv`, file, {
    access: "public",
    allowOverwrite: true,
  })

  // Process file content
  const fileContent = await file.text()
  const processedData = await processCompanyFile(fileContent)

  // Store in Supabase
  const { data: company, error: companyError } = await supabaseAdmin
    .from("companies")
    .upsert({
      name: companyName,
      slug: slug,
      total_questions: processedData.totalQuestions,
      blob_url: blob.url,
      file_name: file.name,
      last_updated: new Date().toISOString(),
    })
    .select()
    .single()

  if (companyError) {
    throw new Error(`Failed to save company ${companyName}: ${JSON.stringify(companyError)}`)
  }

  // Clear existing questions for this company
  await supabaseAdmin.from("questions").delete().eq("company_id", company.id)

  // Store questions in smaller batches
  if (processedData.questions.length > 0) {
    const questionBatchSize = 50
    for (let i = 0; i < processedData.questions.length; i += questionBatchSize) {
      const questionBatch = processedData.questions.slice(i, i + questionBatchSize)

      const { error: questionsError } = await supabaseAdmin.from("questions").insert(
        questionBatch.map((q) => ({
          company_id: company.id,
          question_id: q.id,
          title: q.title,
          url: q.url || q.leetcode_url,
          leetcode_url: q.url || q.leetcode_url,
          is_premium: q.isPremium,
          acceptance: q.acceptance,
          difficulty: q.difficulty,
          frequency: q.frequency,
          topics: q.topics,
        })),
      )

      if (questionsError) {
        console.error(`Error inserting questions batch:`, questionsError)
        throw new Error(`Failed to insert questions: ${JSON.stringify(questionsError)}`)
      }
    }
  }

  return {
    success: true,
    fileName: file.name,
    companyName,
    slug,
    totalQuestions: processedData.totalQuestions,
    blobUrl: blob.url,
  }
}
