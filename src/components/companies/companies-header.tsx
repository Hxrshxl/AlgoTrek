"use client"

import { Search, TrendingUp, Users, BookOpen, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getFavoritesStats } from "@/lib/utils/favorites"

interface CompaniesHeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  totalCompanies?: number
  totalQuestions?: number
}

function CompaniesHeader({
  searchQuery = "",
  onSearchChange = () => {},
  totalCompanies = 0,
  totalQuestions = 0,
}: CompaniesHeaderProps) {
  const [favoritesStats, setFavoritesStats] = useState({ totalFavorites: 0, totalQuestions: 0 })
  const router = useRouter()

  useEffect(() => {
    const updateStats = () => {
      setFavoritesStats(getFavoritesStats())
    }

    updateStats()

    // Listen for storage changes to update favorites count
    window.addEventListener("storage", updateStats)

    // Custom event for same-tab updates
    window.addEventListener("favoritesChanged", updateStats)

    return () => {
      window.removeEventListener("storage", updateStats)
      window.removeEventListener("favoritesChanged", updateStats)
    }
  }, [])

  const handleFavoritesClick = () => {
    router.push("/user/favorites")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice by Company</h1>
          <p className="text-gray-600">Master coding interviews with company-specific question sets</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Companies</p>
            <p className="text-xl font-semibold">{totalCompanies}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Questions</p>
            <p className="text-xl font-semibold">{totalQuestions}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-red-25 rounded-lg p-2 transition-colors"
          onClick={handleFavoritesClick}
        >
          <div className="p-2 bg-red-50 rounded-lg">
            <Heart className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Favorites</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold">{favoritesStats.totalFavorites}</p>
              {favoritesStats.totalFavorites > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  View
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Your Progress</p>
            <p className="text-xl font-semibold">0%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompaniesHeader
export { CompaniesHeader }
