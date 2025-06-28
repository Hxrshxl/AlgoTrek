import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, FileText, TrendingUp } from "lucide-react"
import type { CompanyData } from "@/lib/types/company"

interface CompanyCardProps {
  company: CompanyData
}

export default function CompanyCard({ company }: CompanyCardProps) {
  if (!company) {
    return null
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPopularityLevel = (count: number) => {
    if (count >= 100) return "High"
    if (count >= 50) return "Medium"
    return "Low"
  }

  const difficulties = company.difficulties || []
  const topTopics = company.topTopics || []
  const totalQuestions = company.totalQuestions || 0

  return (
    <Link href={`/user/companies/${company.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-teal-200 group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                <Building2 className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                  {company.name || "Unknown Company"}
                </h3>
                <p className="text-sm text-gray-500 capitalize">{company.category || "Technology"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{totalQuestions} Questions</span>
              </div>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {getPopularityLevel(totalQuestions)}
              </Badge>
            </div>

            {difficulties.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {difficulties.map((diff) => (
                  <Badge key={diff.level} variant="outline" className={`text-xs ${getDifficultyColor(diff.level)}`}>
                    {diff.level} ({diff.count})
                  </Badge>
                ))}
              </div>
            )}

            {topTopics.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Top Topics:</span>
                  <span className="font-medium">{topTopics.slice(0, 2).join(", ")}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
