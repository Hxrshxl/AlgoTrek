"use client"

import { useRouter } from "next/navigation"
import { FavoritesList } from "@/components/companies/favorites-list"
import { Suspense } from "react"
import HamsterLoader from "@/components/ui/hamster-loader"

export default function FavoritesPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/user/companies")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<HamsterLoader message="Loading favorites..." />}>
        <FavoritesList onBack={handleBack} />
      </Suspense>
    </div>
  )
}
