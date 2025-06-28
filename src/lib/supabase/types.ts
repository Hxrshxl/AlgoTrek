export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          total_questions: number | null
          blob_url?: string | null
          file_name?: string | null
          last_updated?: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          total_questions?: number | null
          blob_url?: string | null
          file_name?: string | null
          last_updated?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          total_questions?: number | null
          blob_url?: string | null
          file_name?: string | null
          last_updated?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          company_id: string
          difficulty: string | null
          id: string
          leetcode_url: string | null
          title: string | null
          topics: string[] | null
          question_id?: string | null
          url?: string | null
          is_premium?: boolean | null
          acceptance?: string | null
          frequency?: number | null
        }
        Insert: {
          company_id: string
          difficulty?: string | null
          id?: string
          leetcode_url?: string | null
          title?: string | null
          topics?: string[] | null
          question_id?: string | null
          url?: string | null
          is_premium?: boolean | null
          acceptance?: string | null
          frequency?: number | null
        }
        Update: {
          company_id?: string
          difficulty?: string | null
          id?: string
          leetcode_url?: string | null
          title?: string | null
          topics?: string[] | null
          question_id?: string | null
          url?: string | null
          is_premium?: boolean | null
          acceptance?: string | null
          frequency?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
