import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

interface CompanyDifficulty {
  difficulty: string
  count: number
}

interface CompanyTopic {
  topic: string
  rank: number
}

interface CompanyWithRelations {
  id: string
  name: string
  slug: string
  total_questions: number
  category: string | null
  blob_url: string | null
  file_name: string | null
  last_updated: string | null
  company_difficulties: CompanyDifficulty[]
  company_topics: CompanyTopic[]
}

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

    const formattedCompanies = (companies as CompanyWithRelations[]).map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      totalQuestions: company.total_questions,
      category: company.category,
      blobUrl: company.blob_url,
      fileName: company.file_name,
      lastUpdated: company.last_updated,
      difficulties: company.company_difficulties.map((d: CompanyDifficulty) => ({
        level: d.difficulty,
        count: d.count,
      })),
      topTopics: company.company_topics
        .sort((a: CompanyTopic, b: CompanyTopic) => a.rank - b.rank)
        .slice(0, 5)
        .map((t: CompanyTopic) => t.topic),
    }))

    return NextResponse.json(formattedCompanies)
  } catch (error) {
    console.error("Failed to fetch companies:", error)
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }
}
