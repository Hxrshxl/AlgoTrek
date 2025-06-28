"use client"

import { useState, useEffect, useMemo } from "react"
import CompaniesHeader from "./companies-header"
import CompanyCard from "./company-card"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { Company } from "@/lib/types/company"
import HamsterLoader from "../ui/hamster-loader"

export default function CompaniesList() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching companies from API...")
        const response = await fetch("/api/companies")

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText}`)
        }

        const companiesData = await response.json()
        console.log("Received companies data:", companiesData?.length || 0, "companies")

        if (Array.isArray(companiesData)) {
          // Transform the data to match our Company interface
          const transformedCompanies: Company[] = companiesData.map((company: any) => ({
            id: company.id || company.slug,
            name: company.name,
            slug: company.slug,
            description: company.description || `Practice ${company.name} coding questions`,
            questions: company.questions || [],
            total_questions: company.total_questions || company.totalQuestions || 0,
            easy_count: company.easy_count || company.easyCount || 0,
            medium_count: company.medium_count || company.mediumCount || 0,
            hard_count: company.hard_count || company.hardCount || 0,
            popular_topics: company.popular_topics || company.topTopics || [],
          }))

          setCompanies(transformedCompanies)
          console.log("Successfully loaded", transformedCompanies.length, "companies")
        } else {
          throw new Error("Invalid response format - expected array")
        }
      } catch (err) {
        console.error("Failed to load companies:", err)
        setError(err instanceof Error ? err.message : "Failed to load companies")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.popular_topics?.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }, [companies, searchQuery])

  const totalQuestions = companies.reduce((sum, company) => sum + company.total_questions, 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <HamsterLoader message="Loading companies..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error loading companies:</strong> {error}
            <br />
            <button onClick={() => window.location.reload()} className="mt-2 text-sm underline hover:no-underline">
              Try refreshing the page
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CompaniesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCompanies={companies.length}
        totalQuestions={totalQuestions}
      />

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? `No companies found matching "${searchQuery}". Try a different search term.`
              : "No companies available."}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="mt-2 text-blue-600 hover:text-blue-800 underline">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredCompanies.length} of {companies.length} companies
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export { CompaniesList }
