import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST() {
  try {
    // Delete companies that start with "Data/"
    const { data: duplicateCompanies, error: fetchError } = await supabaseAdmin
      .from("companies")
      .select("id, name")
      .like("name", "Data/%")

    if (fetchError) {
      throw new Error(`Failed to fetch duplicate companies: ${fetchError.message}`)
    }

    if (!duplicateCompanies || duplicateCompanies.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No duplicate companies found to cleanup",
        deletedCount: 0,
      })
    }

    console.log(`Found ${duplicateCompanies.length} duplicate companies to delete`)

    // Delete the duplicate companies (this will cascade delete related data)
    const { error: deleteError } = await supabaseAdmin.from("companies").delete().like("name", "Data/%")

    if (deleteError) {
      throw new Error(`Failed to delete duplicate companies: ${deleteError.message}`)
    }

    console.log(`Successfully deleted ${duplicateCompanies.length} duplicate companies`)

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${duplicateCompanies.length} duplicate companies`,
      deletedCount: duplicateCompanies.length,
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to cleanup duplicates",
      },
      { status: 500 },
    )
  }
}
