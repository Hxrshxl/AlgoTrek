import type { QuestionData, DifficultyCount } from "@/lib/types/company"

interface ProcessedCompanyData {
  totalQuestions: number
  difficulties: DifficultyCount[]
  topTopics: { name: string; count: number }[]
  questions: QuestionData[]
}

export async function processCompanyFile(
  csvContent: string,
  companyName: string,
  slug: string,
): Promise<ProcessedCompanyData> {
  const questions = parseCSV(csvContent)

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
      if (topic.trim()) {
        topicCounts[topic.trim()] = (topicCounts[topic.trim()] || 0) + 1
      }
    })
  })

  // Get top topics with counts
  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  return {
    totalQuestions: questions.length,
    difficulties: difficulties.filter((d) => d.count > 0),
    topTopics,
    questions,
  }
}

function parseCSV(csvText: string): QuestionData[] {
  const lines = csvText.split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const questions: QuestionData[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    if (values.length < headers.length) continue

    try {
      const question: QuestionData = {
        id: values[0]?.replace(/"/g, "") || "",
        title: values[1]?.replace(/"/g, "") || "",
        url: values[2]?.replace(/"/g, "") || "",
        isPremium: values[3]?.replace(/"/g, "") === "Y",
        acceptance: values[4]?.replace(/"/g, "") || "",
        difficulty: (values[5]?.replace(/"/g, "") as "Easy" | "Medium" | "Hard") || "Medium",
        frequency: values[6]?.replace(/"/g, "") || "",
        topics: values[7]
          ? values[7]
              .replace(/"/g, "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      }

      if (question.title) {
        questions.push(question)
      }
    } catch (error) {
      console.error(`Error parsing line ${i}:`, error)
    }
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
