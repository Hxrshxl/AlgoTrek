"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, ArrowLeft, Building2, CheckCircle2, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import type { FavoriteCompany } from "@/lib/types/company"
import { cn, getDifficultyColor } from "@/lib/utils"
import HamsterLoader from "../ui/hamster-loader"
import { getFavoriteCompanies, removeFromFavorites } from "@/lib/utils/favorites"


interface FavoritesListProps {
  onBack: () => void
}

export function FavoritesList({ onBack }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteCompany[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigatingTo, setNavigatingTo] = useState("")

  useEffect(() => {
    setFavorites(getFavoriteCompanies())
  }, [])

  const handleRemoveFavorite = (companyId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    removeFromFavorites(companyId)
    setFavorites(getFavoriteCompanies())

    // Dispatch custom event to update other components
    window.dispatchEvent(new Event("favoritesChanged"))
  }

  const handleCompanyClick = (companyName: string) => {
    setNavigatingTo(companyName)
    setIsNavigating(true)
  }

  const getCompletionStats = (companySlug: string, totalQuestions: number) => {
    if (typeof window === "undefined") return { completed: 0, percentage: 0 }

    const completedQuestions = JSON.parse(localStorage.getItem(`algotrek_progress_${companySlug}`) || "[]")

    return {
      completed: completedQuestions.length,
      percentage: totalQuestions > 0 ? Math.round((completedQuestions.length / totalQuestions) * 100) : 0,
    }
  }

  const totalQuestions = favorites.reduce((sum, fav) => sum + fav.total_questions, 0)

  return (
    <>
      {isNavigating && <HamsterLoader fullScreen message={`Loading ${navigatingTo} questions...`} />}

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={onBack} variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Favorite Companies</h1>
                <p className="text-gray-600">Your bookmarked companies for quick access</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorite Companies</p>
                <p className="text-xl font-semibold">{favorites.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-xl font-semibold">{totalQuestions}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Progress</p>
                <p className="text-xl font-semibold">
                  {favorites.length > 0
                    ? Math.round(
                        favorites.reduce((sum, fav) => {
                          const { percentage } = getCompletionStats(fav.slug, fav.total_questions)
                          return sum + percentage
                        }, 0) / favorites.length,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-4">
                Start adding companies to your favorites by clicking the heart icon on any company card.
              </p>
              <Button onClick={onBack} variant="outline">
                Browse Companies
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((company) => {
              const { completed, percentage } = getCompletionStats(company.slug, company.total_questions)

              return (
                <Card
                  key={company.id}
                  className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-2 hover:border-blue-200 relative"
                >
                  {/* Remove from favorites button */}
                  <Button
                    onClick={(e) => handleRemoveFavorite(company.id, e)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <Link
                    href={`/user/companies/${company.slug}`}
                    onClick={() => handleCompanyClick(company.name)}
                    className="block"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between pr-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {company.name}
                            </CardTitle>
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
                          <div className={cn("text-xs px-2 py-1 rounded border", getDifficultyColor("medium"))}>
                            Medium
                          </div>
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

                      {/* Date Added */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                        <Calendar className="h-3 w-3" />
                        <span>Added {new Date(company.dateAdded).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
