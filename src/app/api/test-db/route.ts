import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("Testing database connection...")

    // Test basic connection
    const { data, error } = await supabaseAdmin.from("companies").select("count(*)").single()

    if (error) {
      console.error("Database connection error:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
      })
    }

    // Test table structure
    const { data: tableInfo, error: tableError } = await supabaseAdmin.from("companies").select("*").limit(1)

    console.log("Database test successful")

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      tablesExist: true,
      companyCount: data?.count || 0,
      tableStructure: tableInfo || [],
    })
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : undefined,
    })
  }
}
