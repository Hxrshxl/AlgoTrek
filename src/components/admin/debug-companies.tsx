"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function DebugCompanies() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    error?: string
    count: number
    companies: Array<{
      id: string
      name: string
      slug: string
      total_questions: number
      is_active: boolean
    }>
    message?: string
  } | null>(null)

  const debugCompanies = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/companies/debug")
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({
        success: false,
        error: "Network error occurred",
        count: 0,
        companies: [],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={debugCompanies} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading Companies...
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-2" />
            Check Database Companies
          </>
        )}
      </Button>

      {result && (
        <Alert className={result.success ? "border-blue-200 bg-blue-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={result.success ? "text-blue-800" : "text-red-800"}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{result.message}</p>
                <Badge variant="outline">{result.count} Companies</Badge>
              </div>

              {result.companies && result.companies.length > 0 && (
                <div className="space-y-3">
                  <p className="font-medium text-sm">Companies in Database:</p>
                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {result.companies.map(
                      (company: {
                        id: string
                        name: string
                        slug: string
                        total_questions: number
                        is_active: boolean
                      }) => (
                        <div key={company.id} className="bg-white p-3 rounded-lg border text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{company.name}</h4>
                            <Badge variant={company.is_active ? "default" : "secondary"}>
                              {company.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                            <div>Slug: {company.slug}</div>
                            <div>Questions: {company.total_questions}</div>
                          </div>
                          <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                            <a
                              href={`/user/companies/${company.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Test Company Page
                            </a>
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {result.count === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">No companies found!</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    You need to upload some company data first. Use the Upload or Bulk Upload tabs.
                  </p>
                </div>
              )}

              {!result.success && (
                <div className="text-sm">
                  <p>
                    <strong>Error:</strong> {result.error}
                  </p>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
