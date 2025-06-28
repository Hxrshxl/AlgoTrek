import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Target, TrendingUp, Hash } from "lucide-react"
import type { CompanyData } from "@/lib/types/company"

interface CompanyStatsProps {
  company: CompanyData
}

export default function CompanyStats({ company }: CompanyStatsProps) {
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

  const getDifficultyPercentage = (count: number) => {
    return Math.round((count / company.totalQuestions) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-600">{company.totalQuestions}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Difficulty Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {company.difficulties.map((diff) => (
            <div key={diff.level} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getDifficultyColor(diff.level)}>
                  {diff.level}
                </Badge>
                <span className="text-sm font-medium">
                  {diff.count} ({getDifficultyPercentage(diff.count)}%)
                </span>
              </div>
              <Progress value={getDifficultyPercentage(diff.count)} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Popular Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {company.topTopics.map((topic, index) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-gray-400">0/{company.totalQuestions}</div>
            <div className="text-sm text-gray-600">Questions Completed</div>
            <Progress value={0} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
