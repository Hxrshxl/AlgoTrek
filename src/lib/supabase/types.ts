export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          total_questions: number
          blob_url: string | null
          file_name: string | null
          category: string
          is_active: boolean
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          total_questions?: number
          blob_url?: string | null
          file_name?: string | null
          category?: string
          is_active?: boolean
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          total_questions?: number
          blob_url?: string | null
          file_name?: string | null
          category?: string
          is_active?: boolean
          last_updated?: string
          created_at?: string
        }
      }
      company_difficulties: {
        Row: {
          id: string
          company_id: string
          difficulty: "Easy" | "Medium" | "Hard"
          count: number
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          difficulty: "Easy" | "Medium" | "Hard"
          count: number
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          difficulty?: "Easy" | "Medium" | "Hard"
          count?: number
          created_at?: string
        }
      }
      company_topics: {
        Row: {
          id: string
          company_id: string
          topic: string
          count: number
          rank: number
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          topic: string
          count: number
          rank?: number
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          topic?: string
          count?: number
          rank?: number
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          company_id: string
          question_id: string
          title: string
          url: string | null
          is_premium: boolean
          acceptance: string | null
          difficulty: "Easy" | "Medium" | "Hard" | null
          frequency: string | null
          topics: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          question_id: string
          title: string
          url?: string | null
          is_premium?: boolean
          acceptance?: string | null
          difficulty?: "Easy" | "Medium" | "Hard" | null
          frequency?: string | null
          topics?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          question_id?: string
          title?: string
          url?: string | null
          is_premium?: boolean
          acceptance?: string | null
          difficulty?: "Easy" | "Medium" | "Hard" | null
          frequency?: string | null
          topics?: string[] | null
          created_at?: string
        }
      }
    }
  }
}
