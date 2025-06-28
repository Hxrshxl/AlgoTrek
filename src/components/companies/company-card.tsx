"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle2, Heart } from "lucide-react"
import type { Company } from "@/lib/types/company"
import HamsterLoader from "@/components/ui/hamster-loader"
import { cn, getDifficultyColor } from "@/lib/utils"
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/utils/favorites"

interface CompanyCardProps {
  company: Company
}

function CompanyCard({ company }: CompanyCardProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    setIsFav(isFavorite(company.id))
  }, [company.id])

  // Get completion stats from localStorage
  const getCompletionStats = () => {
    if (typeof window === "undefined") return { completed: 0, percentage: 0 }

    const completedQuestions = JSON.parse(localStorage.getItem(`algotrek_progress_${company.slug}`) || "[]")

    return {
      completed: completedQuestions.length,
      percentage:
        company.total_questions > 0 ? Math.round((completedQuestions.length / company.total_questions) * 100) : 0,
    }
  }

  const { completed, percentage } = getCompletionStats()

  const handleClick = () => {
    setIsNavigating(true)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFav) {
      removeFromFavorites(company.id)
      setIsFav(false)
    } else {
      addToFavorites(company)
      setIsFav(true)
    }

    // Dispatch custom event to update other components immediately
    window.dispatchEvent(new Event("favoritesChanged"))
  }

  return (
    <>
      {isNavigating && <HamsterLoader fullScreen message={`Loading ${company.name} questions...`} />}

      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-2 hover:border-blue-200 relative">
        {/* Favorite Button */}
        <Button
          onClick={handleFavoriteClick}
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full",
            isFav
              ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50",
          )}
        >
          {isFav ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
        </Button>

        <Link href={`/user/companies/${company.slug}`} onClick={handleClick} className="block">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between pr-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{company.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{company.total_questions} questions</p>
                </div>
              </div>

              {completed > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {completed}/{company.total_questions}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className={cn("text-xs px-2 py-1 rounded border", getDifficultyColor("easy"))}>Easy</div>
                <p className="text-sm font-medium mt-1">{company.easy_count}</p>
              </div>
              <div className="text-center">
                <div className={cn("text-xs px-2 py-1 rounded border", getDifficultyColor("medium"))}>Medium</div>
                <p className="text-sm font-medium mt-1">{company.medium_count}</p>
              </div>
              <div className="text-center">
                <div className={cn("text-xs px-2 py-1 rounded border", getDifficultyColor("hard"))}>Hard</div>
                <p className="text-sm font-medium mt-1">{company.hard_count}</p>
              </div>
            </div>

            {/* Popular Topics */}
            {company.popular_topics && company.popular_topics.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Popular Topics</p>
                <div className="flex flex-wrap gap-1">
                  {company.popular_topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {company.popular_topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{company.popular_topics.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Link>
      </Card>
    </>
  )
}

export default CompanyCard
export { CompanyCard }
