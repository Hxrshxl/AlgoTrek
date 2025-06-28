"use client"

import { useState, useEffect } from "react"
import CompanyCard from "./company-card"
import type { CompanyData } from "@/lib/types/company"
import { Building2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CompaniesList() {
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadCompanies() {
      try {
        setError(null)
        const response = await fetch("/api/companies")

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText}`)
        }

        const companiesData = await response.json()

        if (Array.isArray(companiesData)) {
          setCompanies(companiesData)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Failed to load companies:", error)
        setError(error instanceof Error ? error.message : "Failed to load companies")
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [])

  const filteredCompanies = companies.filter((company) =>
    company?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="text-center py-8">Loading companies...</div>
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Error loading companies:</strong> {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Companies ({filteredCompanies.length})</h2>
          <p className="text-gray-600 text-sm mt-1">Practice questions from leading tech companies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.slug || company.id} company={company} />
        ))}
      </div>

      {filteredCompanies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">
            {companies.length === 0 ? "No companies have been uploaded yet." : "Try adjusting your search criteria"}
          </p>
        </div>
      )}
    </div>
  )
}
