import { supabaseAdmin } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Fetching companies from database...")

    // First, let's fetch companies without description to see what columns exist
    const { data: companies, error } = await supabaseAdmin
      .from("companies")
      .select(`
        id,
        name,
        slug,
        total_questions,
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
      return NextResponse.json({ error: "Failed to fetch companies", details: error.message }, { status: 500 })
    }

    if (!companies) {
      return NextResponse.json([])
    }

    console.log(`Found ${companies.length} companies`)

    // Transform the data to include difficulty counts and popular topics
    const transformedCompanies = companies.map((company) => {
      const questions = company.questions || []

      // Calculate difficulty counts
      const easy_count = questions.filter((q) => q.difficulty === "Easy").length
      const medium_count = questions.filter((q) => q.difficulty === "Medium").length
      const hard_count = questions.filter((q) => q.difficulty === "Hard").length

      // Calculate popular topics
      const topicCounts: Record<string, number> = {}
      questions.forEach((question) => {
        if (question.topics && Array.isArray(question.topics)) {
          question.topics.forEach((topic) => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1
          })
        }
      })

      const popular_topics = Object.entries(topicCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([topic]) => topic)

      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        description: `Practice ${company.name} coding interview questions`, // Generate description
        total_questions: company.total_questions || questions.length,
        easy_count,
        medium_count,
        hard_count,
        popular_topics,
        questions: questions.map((q) => ({
          id: q.id,
          title: q.title,
          difficulty: q.difficulty,
          topics: q.topics,
        })),
      }
    })

    console.log(`Returning ${transformedCompanies.length} transformed companies`)
    return NextResponse.json(transformedCompanies)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
