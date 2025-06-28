"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DatabaseTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Network error occurred",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={testConnection} disabled={testing} className="w-full">
        {testing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Testing Connection...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Test Database Connection
          </>
        )}
      </Button>

      {result && (
        <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
            {result.success ? (
              <div>
                <p className="font-medium">✅ Database connection successful!</p>
                <div className="mt-2 text-sm">
                  <p>• Tables exist: {result.tablesExist ? "Yes" : "No"}</p>
                  <p>• Current companies: {result.companyCount}</p>
                  <p>• Ready for uploads: Yes</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-medium">❌ Database connection failed</p>
                <p className="mt-1 text-sm">{result.error}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
