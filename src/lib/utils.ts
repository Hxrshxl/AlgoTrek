import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompanyName(filename: string): string {
  return filename
    .replace(/\.csv$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-600 bg-green-50 border-green-200"
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "hard":
      return "text-red-600 bg-red-50 border-red-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return "bg-green-500"
  if (percentage >= 60) return "bg-blue-500"
  if (percentage >= 40) return "bg-yellow-500"
  if (percentage >= 20) return "bg-orange-500"
  return "bg-red-500"
}
