import { Suspense } from "react"
import CompaniesLoading from "@/components/companies/companies-loading"

import { CompaniesList } from "@/components/companies/companies-list"
import { CompaniesHeader } from "@/components/companies/companies-header"

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CompaniesHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<CompaniesLoading />}>
          <CompaniesList />
        </Suspense>
      </main>
    </div>
  )
}
