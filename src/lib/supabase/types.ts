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
        }
        Insert: {
          id?: string
          name: string
          slug: string
          total_questions?: number | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          total_questions?: number | null
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
        }
        Insert: {
          company_id: string
          difficulty?: string | null
          id?: string
          leetcode_url?: string | null
          title?: string | null
          topics?: string[] | null
        }
        Update: {
          company_id?: string
          difficulty?: string | null
          id?: string
          leetcode_url?: string | null
          title?: string | null
          topics?: string[] | null
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
