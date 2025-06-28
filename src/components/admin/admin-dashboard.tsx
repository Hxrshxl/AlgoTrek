"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Upload, FolderOpen, Eye, Trash2, Settings, BarChart3 } from "lucide-react"
import DatabaseTest from "./database-test"
import DebugCompanies from "./debug-companies"
import FileUpload from "./file-upload"
import BulkUpload from "./bulk-upload"
import BulkUploadCleanup from "./bulk-upload-cleanup"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Manage companies, upload data, and monitor system health</p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="bulk-upload" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Bulk Upload
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Debug
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Connected</div>
                <p className="text-xs text-muted-foreground">Supabase connection active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Companies in database</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Vercel Blob</div>
                <p className="text-xs text-muted-foreground">File storage active</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Test Database</h3>
                      <p className="text-sm text-gray-600">Verify database connectivity</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Upload className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Upload Company</h3>
                      <p className="text-sm text-gray-600">Add a single company CSV</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FolderOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Bulk Upload</h3>
                      <p className="text-sm text-gray-600">Upload multiple companies</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Eye className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Debug Data</h3>
                      <p className="text-sm text-gray-600">View database contents</p>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          <DatabaseTest />
        </TabsContent>

        {/* Single Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Single Company Upload
              </CardTitle>
              <CardDescription>Upload a single CSV file containing questions for one company</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Upload Tab */}
        <TabsContent value="bulk-upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Bulk Company Upload
              </CardTitle>
              <CardDescription>Upload multiple CSV files at once (up to 270 files)</CardDescription>
            </CardHeader>
            <CardContent>
              <BulkUpload />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Database Debug Tools
              </CardTitle>
              <CardDescription>Inspect and troubleshoot database contents</CardDescription>
            </CardHeader>
            <CardContent>
              <DebugCompanies />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Database Maintenance
              </CardTitle>
              <CardDescription>Clean up and maintain database integrity</CardDescription>
            </CardHeader>
            <CardContent>
              <BulkUploadCleanup />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system status and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Environment:</span>
                  <span className="ml-2 text-gray-600">Development</span>
                </div>
                <div>
                  <span className="font-medium">Database:</span>
                  <span className="ml-2 text-gray-600">Supabase PostgreSQL</span>
                </div>
                <div>
                  <span className="font-medium">File Storage:</span>
                  <span className="ml-2 text-gray-600">Vercel Blob</span>
                </div>
                <div>
                  <span className="font-medium">Framework:</span>
                  <span className="ml-2 text-gray-600">Next.js 15</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
