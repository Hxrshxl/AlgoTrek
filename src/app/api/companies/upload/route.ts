import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { supabaseAdmin } from "@/lib/supabase/server"
import { processCompanyFile } from "@/lib/utils/file-processor"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const companyName = formData.get("companyName") as string

    if (!file || !companyName) {
      return NextResponse.json({ error: "File and company name are required" }, { status: 400 })
    }

    console.log("Processing upload for:", companyName)

    // Generate slug from company name
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    console.log("Generated slug:", slug)

    // Upload file to Vercel Blob
    const blob = await put(`companies/${slug}.csv`, file, {
      access: "public",
      allowOverwrite: true,
    })

    console.log("File uploaded to blob:", blob.url)

    // Process the file and extract data
    const fileContent = await file.text()
    const processedData = await processCompanyFile(fileContent, companyName, slug)

    console.log("Processed data:", {
      totalQuestions: processedData.totalQuestions,
      difficultiesCount: processedData.difficulties.length,
      topicsCount: processedData.topTopics.length,
    })

    // Prepare company data for insertion
    const companyData = {
      name: companyName,
      slug: slug,
      total_questions: processedData.totalQuestions,
      blob_url: blob.url,
      file_name: file.name,
      last_updated: new Date().toISOString(),
    }

    console.log("Inserting company data:", companyData)

    // Store company data in Supabase
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .upsert(companyData)
      .select()
      .single()

    if (companyError) {
      console.error("Supabase company error:", companyError)
      throw new Error(`Failed to save company: ${JSON.stringify(companyError)}`)
    }

    console.log("Company saved successfully:", company.id)

    // Clear existing difficulty data for this company
    await supabaseAdmin.from("company_difficulties").delete().eq("company_id", company.id)

    // Store difficulty data
    if (processedData.difficulties.length > 0) {
      const difficultyData = processedData.difficulties.map((diff) => ({
        company_id: company.id,
        difficulty: diff.level,
        count: diff.count,
      }))

      console.log("Inserting difficulty data:", difficultyData)

      const { error: diffError } = await supabaseAdmin.from("company_difficulties").insert(difficultyData)

      if (diffError) {
        console.error("Failed to save difficulties:", diffError)
      }
    }

    // Clear existing topic data for this company
    await supabaseAdmin.from("company_topics").delete().eq("company_id", company.id)

    // Store topic data
    if (processedData.topTopics.length > 0) {
      const topicData = processedData.topTopics.map((topic, index) => ({
        company_id: company.id,
        topic: topic.name,
        count: topic.count,
        rank: index + 1,
      }))

      console.log("Inserting topic data:", topicData.slice(0, 3)) // Log first 3 topics

      const { error: topicsError } = await supabaseAdmin.from("company_topics").insert(topicData)

      if (topicsError) {
        console.error("Failed to save topics:", topicsError)
      }
    }

    // Clear existing questions for this company
    await supabaseAdmin.from("questions").delete().eq("company_id", company.id)

    // Store individual questions (in batches to avoid large requests)
    if (processedData.questions.length > 0) {
      const batchSize = 100
      const questionBatches = []

      for (let i = 0; i < processedData.questions.length; i += batchSize) {
        questionBatches.push(processedData.questions.slice(i, i + batchSize))
      }

      console.log(`Inserting ${processedData.questions.length} questions in ${questionBatches.length} batches`)

      for (const batch of questionBatches) {
        const questionData = batch.map((q) => ({
          company_id: company.id,
          question_id: q.id,
          title: q.title,
          url: q.url,
          is_premium: q.isPremium,
          acceptance: q.acceptance,
          difficulty: q.difficulty,
          frequency: q.frequency,
          topics: q.topics,
        }))

        const { error: questionsError } = await supabaseAdmin.from("questions").insert(questionData)

        if (questionsError) {
          console.error("Failed to save questions batch:", questionsError)
        }
      }
    }

    console.log("Upload completed successfully")

    return NextResponse.json({
      success: true,
      company: company,
      blobUrl: blob.url,
      processedData: {
        totalQuestions: processedData.totalQuestions,
        difficulties: processedData.difficulties,
        topTopics: processedData.topTopics.slice(0, 5),
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload and process file",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
