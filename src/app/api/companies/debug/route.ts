import { supabaseAdmin } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface CompanyWithRelations {
  id: string
  name: string
  slug: string
  total_questions: number | null
  blob_url?: string | null
  file_name?: string | null
  last_updated?: string | null
  questions: Array<{
    id: string
    title: string | null
    difficulty: string | null
    topics: string[] | null
  }>
}

export async function GET() {
  try {
    console.log("=== DEBUG: Fetching companies with relations ===")

    const { data: companies, error } = await supabaseAdmin
      .from("companies")
      .select(`
        id,
        name,
        slug,
        total_questions,
        blob_url,
        file_name,
        last_updated,
        questions (
          id,
          title,
          difficulty,
          topics
        )
      `)
      .order("name")

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error", details: error }, { status: 500 })
    }

    console.log(`Found ${companies?.length || 0} companies`)

    const formattedCompanies = (companies || []).map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      total_questions: company.total_questions,
      blob_url: company.blob_url,
      file_name: company.file_name,
      last_updated: company.last_updated,
      questions_count: company.questions?.length || 0,
      questions: company.questions || [],
      // Calculate difficulty breakdown from questions
      difficulty_breakdown: {
        easy: company.questions?.filter((q) => q.difficulty === "Easy").length || 0,
        medium: company.questions?.filter((q) => q.difficulty === "Medium").length || 0,
        hard: company.questions?.filter((q) => q.difficulty === "Hard").length || 0,
      },
      // Calculate top topics from questions
      top_topics: getTopTopics(company.questions || []),
    }))

    console.log("=== DEBUG: Sample company data ===")
    if (formattedCompanies.length > 0) {
      console.log(JSON.stringify(formattedCompanies[0], null, 2))
    }

    return NextResponse.json({
      success: true,
      total_companies: formattedCompanies.length,
      companies: formattedCompanies,
      sample_company: formattedCompanies[0] || null,
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function getTopTopics(questions: Array<{ topics: string[] | null }>): Array<{ name: string; count: number }> {
  const topicCounts: Record<string, number> = {}

  questions.forEach((question) => {
    if (question.topics && Array.isArray(question.topics)) {
      question.topics.forEach((topic) => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1
      })
    }
  })

  return Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))
}
