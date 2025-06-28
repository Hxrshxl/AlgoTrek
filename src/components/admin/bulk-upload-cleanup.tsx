"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BulkUploadCleanup() {
  const [cleaning, setCleaning] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    deletedCount?: number
  } | null>(null)

  const cleanupDuplicates = async () => {
    setCleaning(true)
    setResult(null)

    try {
      const response = await fetch("/api/companies/cleanup", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          deletedCount: data.deletedCount,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Cleanup failed",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error occurred during cleanup",
      })
    } finally {
      setCleaning(false)
    }
  }

  return (
    <div className="space-y-4">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Warning:</strong> This will permanently delete all companies that have names starting with "Data/".
          Make sure you want to proceed before clicking cleanup.
        </AlertDescription>
      </Alert>

      <Button onClick={cleanupDuplicates} disabled={cleaning} variant="destructive" className="w-full">
        {cleaning ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Cleaning up...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            Cleanup Duplicate Companies
          </>
        )}
      </Button>

      {result && (
        <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
            {result.message}
            {result.success && result.deletedCount && (
              <p className="mt-1 text-sm">Deleted {result.deletedCount} duplicate companies.</p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
