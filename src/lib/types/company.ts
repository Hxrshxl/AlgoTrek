export interface QuestionData {
  id: string
  title: string
  url: string
  isPremium: boolean
  acceptance: string
  difficulty: "Easy" | "Medium" | "Hard"
  frequency: string
  topics: string[]
}

export interface DifficultyCount {
  level: "Easy" | "Medium" | "Hard"
  count: number
}

export interface CompanyData {
  id?: string
  name: string
  slug: string
  totalQuestions: number
  difficulties: DifficultyCount[]
  topTopics: string[]
  category?: string
  blobUrl?: string
  fileName?: string
  lastUpdated?: string
  questions?: QuestionData[]
}
