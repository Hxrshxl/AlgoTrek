"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { Button, Typography, Box, Paper, CircularProgress } from "@mui/material"
import { styled } from "@mui/system"

const StyledDropzone = styled("div")({
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "20px",
})

const StyledPaper = styled(Paper)({
  padding: "20px",
  marginBottom: "20px",
})

interface ParsedDataRow {
  [key: string]: string | number
}

const BulkUpload = () => {
  const [parsedData, setParsedData] = useState<ParsedDataRow[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data as ParsedDataRow[])
      },
      error: (error) => {
        console.error("Error parsing CSV:", error)
        setUploadError("Error parsing CSV file.")
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = async () => {
    setUploading(true)
    setUploadSuccess(false)
    setUploadError(null)

    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real application, you would send the parsedData to your API endpoint here.
      console.log("Data to be uploaded:", parsedData)

      // Simulate success
      setUploadSuccess(true)
      setParsedData([]) // Clear the data after successful upload
    } catch (error) {
      console.error("Upload failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Upload failed. Please try again."
      setUploadError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Bulk Upload
      </Typography>

      <StyledDropzone {...getRootProps()}>
        <input
          {...getInputProps()}
          ref={(el) => {
            if (el) {
              // @ts-expect-error - webkitdirectory is not in the standard HTMLInputElement type
              el.webkitdirectory = true
              fileInputRef.current = el
            }
          }}
        />
        {isDragActive ? (
          <Typography>Drop the files here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop some files here, or click to select files</Typography>
        )}
      </StyledDropzone>

      {parsedData.length > 0 && (
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Parsed Data
          </Typography>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
          <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </Button>
        </StyledPaper>
      )}

      {uploadSuccess && (
        <Typography variant="body1" color="success">
          Upload successful!
        </Typography>
      )}

      {uploadError && (
        <Typography variant="body1" color="error">
          Error: {uploadError}
        </Typography>
      )}
    </Box>
  )
}

export default BulkUpload
