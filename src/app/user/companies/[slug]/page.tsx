import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/server"
import CompanyHeader from "@/components/company/company-header"
import QuestionsTable from "@/components/company/questions-table"
import CompanyStats from "@/components/company/company-stats"

interface CompanyPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCompanyData(slug: string) {
  try {
    console.log(`Fetching company data for slug: ${slug}`)

    const { data: company, error } = await supabaseAdmin
      .from("companies")
      .select(`
        *,
        questions(*)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching company:", error)
      return null
    }

    if (!company) {
      console.log(`No company found with slug: ${slug}`)
      return null
    }

    console.log(`Found company: ${company.name} with ${company.questions?.length || 0} questions`)

    // Calculate difficulties from questions
    const questions = company.questions || []
    const difficultyCount: Record<string, number> = {}
    const topicCount: Record<string, number> = {}

    questions.forEach((q: any) => {
      // Count difficulties
      const difficulty = q.difficulty || "Medium"
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1

      // Count topics
      if (q.topics && Array.isArray(q.topics)) {
        q.topics.forEach((topic: string) => {
          topicCount[topic] = (topicCount[topic] || 0) + 1
        })
      }
    })

    const difficulties = Object.entries(difficultyCount).map(([level, count]) => ({
      level,
      count,
    }))

    const topTopics = Object.entries(topicCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic)

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      totalQuestions: company.total_questions || questions.length,
      category: "Technology", // Default category since it's not in the schema
      lastUpdated: company.last_updated || new Date().toISOString(),
      difficulties,
      topTopics,
      questions: questions.map((q: any) => ({
        id: q.question_id || q.id,
        title: q.title || "Untitled Question",
        url: q.url || q.leetcode_url || "",
        isPremium: q.is_premium || false,
        acceptance: q.acceptance || "N/A",
        difficulty: q.difficulty || "Medium",
        frequency: q.frequency || "N/A",
        topics: q.topics || [],
      })),
    }
  } catch (error) {
    console.error("Error in getCompanyData:", error)
    return null
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params
  const company = await getCompanyData(slug)

  if (!company) {
    console.log(`Company not found, showing 404 for slug: ${slug}`)
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={company} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CompanyStats company={company} />
          </div>
          <div className="lg:col-span-3">
            <QuestionsTable questions={company.questions} companySlug={company.slug} />
          </div>
        </div>
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { slug } = await params
  const company = await getCompanyData(slug)

  if (!company) {
    return {
      title: "Company Not Found",
    }
  }

  return {
    title: `${company.name} - DSA Questions | AlgoTrek`,
    description: `Practice ${company.totalQuestions} DSA questions asked by ${company.name}. Difficulty breakdown and topic-wise questions.`,
  }
}
