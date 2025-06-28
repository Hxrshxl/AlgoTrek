import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
  try {
    const { data: companies, error } = await supabase
      .from("companies")
      .select(`
        *,
        company_difficulties(*),
        company_topics(*)
      `)
      .eq("is_active", true)
      .order("total_questions", { ascending: false })

    if (error) {
      throw error
    }

    const formattedCompanies = companies.map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      totalQuestions: company.total_questions,
      category: company.category,
      blobUrl: company.blob_url,
      fileName: company.file_name,
      lastUpdated: company.last_updated,
      difficulties: company.company_difficulties.map((d) => ({
        level: d.difficulty,
        count: d.count,
      })),
      topTopics: company.company_topics
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5)
        .map((t) => t.topic),
    }))

    return NextResponse.json(formattedCompanies)
  } catch (error) {
    console.error("Failed to fetch companies:", error)
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }
}
