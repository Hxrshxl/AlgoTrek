"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FolderOpen, CheckCircle, AlertCircle, Loader2, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadResult {
  successful: Array<{
    fileName: string
    companyName: string
    totalQuestions: number
  }>
  failed: Array<{
    fileName: string
    error: string
  }>
  total: number
}

export default function BulkUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    results?: UploadResult
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const csvFiles = selectedFiles.filter((file) => file.name.toLowerCase().endsWith(".csv"))

    if (csvFiles.length !== selectedFiles.length) {
      alert(`${selectedFiles.length - csvFiles.length} non-CSV files were filtered out`)
    }

    setFiles(csvFiles)
    setResult(null)
  }

  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleBulkUpload = async () => {
    if (files.length === 0) {
      alert("Please select CSV files first")
      return
    }

    setUploading(true)
    setProgress(0)
    setResult(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Start upload
      const response = await fetch("/api/companies/bulk-upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          results: data.results,
        })
        setFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setResult({
          success: false,
          message: data.error || "Bulk upload failed",
        })
      }
    } catch {
      setResult({
        success: false,
        message: "Network error occurred during bulk upload",
      })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload Company Data
        </CardTitle>
        <p className="text-sm text-gray-600">Upload multiple CSV files at once (up to 270 files)</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileSelection}
              className="hidden"
              webkitdirectory=""
            />
            <Button onClick={handleFolderSelect} variant="outline" className="flex-1 bg-transparent">
              <FolderOpen className="h-4 w-4 mr-2" />
              Select Folder with CSV Files
            </Button>
            <input
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileSelection}
              className="hidden"
              id="file-input-multiple"
            />
            <Button
              onClick={() => document.getElementById("file-input-multiple")?.click()}
              variant="outline"
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Select Individual Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Selected Files ({files.length})</h3>
                <Button onClick={() => setFiles([])} variant="ghost" size="sm">
                  Clear All
                </Button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {files.slice(0, 10).map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-gray-500 mx-2">({(file.size / 1024).toFixed(1)} KB)</span>
                    <Button onClick={() => removeFile(index)} variant="ghost" size="sm" className="h-6 w-6 p-0">
                      ×
                    </Button>
                  </div>
                ))}
                {files.length > 10 && (
                  <div className="text-sm text-gray-500 text-center py-2">... and {files.length - 10} more files</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing files...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        <Button onClick={handleBulkUpload} disabled={files.length === 0 || uploading} className="w-full" size="lg">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing {files.length} files...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload {files.length} Files
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              <div className="space-y-2">
                <p className="font-medium">{result.message}</p>

                {result.results && (
                  <div className="text-sm space-y-2">
                    <div className="grid grid-cols-3 gap-4 p-3 bg-white rounded border">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{result.results.successful.length}</div>
                        <div className="text-xs">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{result.results.failed.length}</div>
                        <div className="text-xs">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{result.results.total}</div>
                        <div className="text-xs">Total</div>
                      </div>
                    </div>

                    {result.results.failed.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">View Failed Files</summary>
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                          {result.results.failed.map((failure: { fileName: string; error: string }, index: number) => (
                            <div key={index} className="text-xs bg-red-100 p-2 rounded">
                              <strong>{failure.fileName}:</strong> {failure.error}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    {result.results.successful.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">View Successful Uploads</summary>
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                          {result.results.successful
                            .slice(0, 10)
                            .map((success: { companyName: string; totalQuestions: number }, index: number) => (
                              <div key={index} className="text-xs bg-green-100 p-2 rounded">
                                <strong>{success.companyName}:</strong> {success.totalQuestions} questions
                              </div>
                            ))}
                          {result.results.successful.length > 10 && (
                            <div className="text-xs text-center py-1">
                              ... and {result.results.successful.length - 10} more
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
