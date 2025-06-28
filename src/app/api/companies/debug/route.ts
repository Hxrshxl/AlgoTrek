import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("Fetching companies from database...")

    const { data: companies, error } = await supabaseAdmin
      .from("companies")
      .select(`
        *,
        company_difficulties(*),
        company_topics(*)
      `)
      .eq("is_active", true)
      .order("total_questions", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    console.log(`Found ${companies?.length || 0} companies`)

    const formattedCompanies = (companies || []).map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      totalQuestions: company.total_questions,
      category: company.category,
      blobUrl: company.blob_url,
      fileName: company.file_name,
      lastUpdated: company.last_updated,
      difficulties: (company.company_difficulties || []).map((d: any) => ({
        level: d.difficulty,
        count: d.count,
      })),
      topTopics: (company.company_topics || [])
        .sort((a: any, b: any) => a.rank - b.rank)
        .slice(0, 5)
        .map((t: any) => t.topic),
    }))

    return NextResponse.json(formattedCompanies)
  } catch (error) {
    console.error("Failed to fetch companies:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch companies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
