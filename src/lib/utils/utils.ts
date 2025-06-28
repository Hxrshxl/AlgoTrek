import type { CompanyData, QuestionData, DifficultyCount } from "@/lib/types/company"

// This would be replaced with actual Vercel Blob URLs
const COMPANY_FILES = [
  {
    name: "Accolite",
    slug: "accolite",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/accolite-43s6vuaHKO9FzEYozMM2XTmlyrSOiB.csv",
  },
  {
    name: "Accenture",
    slug: "accenture",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/accenture-Rg9XmDXi0kiZFnft8GDA5tvZkT52OZ.csv",
  },
  {
    name: "Activision",
    slug: "activision",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/activision-W2QXcHeWUKZ9KQlIXudcFp7VHCVIUH.csv",
  },
  // Add more companies here as you upload them to Vercel Blob
]

export async function getCompaniesData(): Promise<CompanyData[]> {
  const companies: CompanyData[] = []

  for (const company of COMPANY_FILES) {
    try {
      const response = await fetch(company.url)
      const csvText = await response.text()
      const questions = parseCSV(csvText)

      const companyData = processCompanyData(company.name, company.slug, questions)
      companies.push(companyData)
    } catch (error) {
      console.error(`Failed to load data for ${company.name}:`, error)
    }
  }

  return companies.sort((a, b) => b.totalQuestions - a.totalQuestions)
}

function parseCSV(csvText: string): QuestionData[] {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

  const questions: QuestionData[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    if (values.length < headers.length) continue

    const question: QuestionData = {
      id: values[0] || "",
      title: values[1] || "",
      url: values[2] || "",
      isPremium: values[3] === "Y",
      acceptance: values[4] || "",
      difficulty: (values[5] as "Easy" | "Medium" | "Hard") || "Medium",
      frequency: values[6] || "",
      topics: values[7] ? values[7].split(",").map((t) => t.trim()) : [],
    }

    questions.push(question)
  }

  return questions
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function processCompanyData(name: string, slug: string, questions: QuestionData[]): CompanyData {
  const difficulties: DifficultyCount[] = [
    { level: "Easy", count: 0 },
    { level: "Medium", count: 0 },
    { level: "Hard", count: 0 },
  ]

  const topicCounts: Record<string, number> = {}

  questions.forEach((question) => {
    // Count difficulties
    const diffIndex = difficulties.findIndex((d) => d.level === question.difficulty)
    if (diffIndex !== -1) {
      difficulties[diffIndex].count++
    }

    // Count topics
    question.topics.forEach((topic) => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1
    })
  })

  // Get top 5 topics
  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic]) => topic)

  return {
    name,
    slug,
    totalQuestions: questions.length,
    difficulties: difficulties.filter((d) => d.count > 0),
    topTopics,
    questions,
  }
}

export async function getCompanyData(slug: string): Promise<CompanyData | null> {
  const companies = await getCompaniesData()
  return companies.find((c) => c.slug === slug) || null
}
