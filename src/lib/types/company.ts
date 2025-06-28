export interface Question {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  topics: string[]
  leetcode_url?: string
  description?: string
  company_id: string
}

export interface Company {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  questions: Question[]
  total_questions: number
  easy_count: number
  medium_count: number
  hard_count: number
  popular_topics: string[]
}

export interface CompanyStats {
  total_questions: number
  completed_questions: number
  easy_completed: number
  medium_completed: number
  hard_completed: number
  completion_percentage: number
}

export interface QuestionFilters {
  difficulty: string[]
  topics: string[]
  completed: "all" | "completed" | "incomplete"
  search: string
}

export interface FavoriteCompany {
  id: string
  name: string
  slug: string
  total_questions: number
  easy_count: number
  medium_count: number
  hard_count: number
  popular_topics: string[]
  dateAdded: string
}

export interface FavoritesStats {
  totalFavorites: number
  totalQuestions: number
  averageProgress: number
}
