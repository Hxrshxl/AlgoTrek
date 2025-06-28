import Link from "next/link"
import { ArrowLeft, Building2, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CompanyData } from "@/lib/types/company"

interface CompanyHeaderProps {
  company: CompanyData
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  if (!company) {
    return null
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently"

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Recently"
    }
  }

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/user/companies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-100 rounded-xl">
              <Building2 className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name || "Unknown Company"}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge variant="outline" className="capitalize">
                  {company.category || "Technology"}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {formatDate(company.lastUpdated)}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-2">
                Practice {company.totalQuestions || 0} carefully curated DSA questions asked by{" "}
                {company.name || "this company"} in technical interviews.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              LeetCode Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
