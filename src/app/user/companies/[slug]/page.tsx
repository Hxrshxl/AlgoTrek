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
        company_difficulties(*),
        company_topics(*),
        questions(*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
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

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      totalQuestions: company.total_questions || 0,
      category: company.category || "Technology",
      lastUpdated: company.last_updated || new Date().toISOString(),
      difficulties: (company.company_difficulties || []).map((d: { difficulty: string; count: number }) => ({
        level: d.difficulty,
        count: d.count,
      })),
      topTopics: (company.company_topics || [])
        .sort((a: { rank: number }, b: { rank: number }) => a.rank - b.rank)
        .slice(0, 10)
        .map((t: { topic: string }) => t.topic),
      questions: (company.questions || []).map(
        (q: {
          question_id?: string
          id: string
          title?: string
          url?: string
          is_premium?: boolean
          acceptance?: string
          difficulty?: string
          frequency?: string
          topics?: string[]
        }) => ({
          id: q.question_id || q.id,
          title: q.title || "Untitled Question",
          url: q.url || "",
          isPremium: q.is_premium || false,
          acceptance: q.acceptance || "N/A",
          difficulty: q.difficulty || "Medium",
          frequency: q.frequency || "N/A",
          topics: q.topics || [],
        }),
      ),
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
