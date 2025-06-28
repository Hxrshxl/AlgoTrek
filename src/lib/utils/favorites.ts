import type { Company, FavoriteCompany } from "@/lib/types/company"

const FAVORITES_KEY = "algotrek_favorites"

export function getFavoriteCompanies(): FavoriteCompany[] {
  if (typeof window === "undefined") return []

  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error("Error loading favorites:", error)
    return []
  }
}

export function addToFavorites(company: Company): void {
  if (typeof window === "undefined") return

  const favorites = getFavoriteCompanies()
  const favoriteCompany: FavoriteCompany = {
    id: company.id,
    name: company.name,
    slug: company.slug,
    total_questions: company.total_questions,
    easy_count: company.easy_count,
    medium_count: company.medium_count,
    hard_count: company.hard_count,
    popular_topics: company.popular_topics,
    dateAdded: new Date().toISOString(),
  }

  const updatedFavorites = [...favorites, favoriteCompany]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
}

export function removeFromFavorites(companyId: string): void {
  if (typeof window === "undefined") return

  const favorites = getFavoriteCompanies()
  const updatedFavorites = favorites.filter((fav) => fav.id !== companyId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
}

export function isFavorite(companyId: string): boolean {
  if (typeof window === "undefined") return false

  const favorites = getFavoriteCompanies()
  return favorites.some((fav) => fav.id === companyId)
}

export function getFavoritesStats(): { totalFavorites: number; totalQuestions: number } {
  const favorites = getFavoriteCompanies()
  const totalQuestions = favorites.reduce((sum, fav) => sum + fav.total_questions, 0)

  return {
    totalFavorites: favorites.length,
    totalQuestions,
  }
}
