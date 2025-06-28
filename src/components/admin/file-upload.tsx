"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: any
    details?: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      // Auto-generate company name from filename
      const name = selectedFile.name.replace(/\.csv$/i, "").replace(/[-_]/g, " ")
      setCompanyName(name.charAt(0).toUpperCase() + name.slice(1))
    } else {
      setFile(null)
      alert("Please select a CSV file")
    }
  }

  const handleUpload = async () => {
    if (!file || !companyName.trim()) {
      alert("Please select a file and enter a company name")
      return
    }

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("companyName", companyName.trim())

      const response = await fetch("/api/companies/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully uploaded ${companyName} with ${data.processedData.totalQuestions} questions`,
          data: data.processedData,
        })
        setFile(null)
        setCompanyName("")
        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setResult({
          success: false,
          message: data.error || "Upload failed",
          details: data.details,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error occurred",
        details: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Company Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name (e.g., Google, Microsoft)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-input">CSV File</Label>
          <Input id="file-input" type="file" accept=".csv" onChange={handleFileChange} />
          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <Button onClick={handleUpload} disabled={!file || !companyName.trim() || uploading} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Process
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
              {result.message}
              {result.success && result.data && (
                <div className="mt-2 text-sm">
                  <p>Difficulties: {result.data.difficulties.map((d: any) => `${d.level} (${d.count})`).join(", ")}</p>
                  <p>
                    Top Topics:{" "}
                    {result.data.topTopics
                      .slice(0, 3)
                      .map((t: any) => t.name)
                      .join(", ")}
                  </p>
                </div>
              )}
              {!result.success && result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
                  <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">{result.details}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
