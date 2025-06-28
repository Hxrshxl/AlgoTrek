import { Building2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CompaniesHeader() {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Building2 className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
            <p className="text-gray-600 mt-1">Explore DSA questions from top tech companies</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search companies..."
            className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  )
}
