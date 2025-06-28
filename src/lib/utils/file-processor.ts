export interface ProcessedQuestion {
  id: string
  title: string
  url?: string
  leetcode_url?: string
  isPremium?: boolean
  acceptance?: string
  difficulty: string
  frequency?: number
  topics: string[]
}

export interface ProcessedCompanyData {
  questions: ProcessedQuestion[]
  totalQuestions: number
  difficulties: Array<{ level: string; count: number }>
  topTopics: Array<{ name: string; count: number }>
}

export async function processCompanyFile(fileContent: string): Promise<ProcessedCompanyData> {
  const lines = fileContent.split("\n").filter((line) => line.trim())
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

  const questions: ProcessedQuestion[] = []
  const difficultyCount: Record<string, number> = {}
  const topicCount: Record<string, number> = {}

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

    if (values.length < headers.length) continue

    const question: ProcessedQuestion = {
      id: values[headers.indexOf("ID")] || `q-${i}`,
      title: values[headers.indexOf("Title")] || values[headers.indexOf("Question")] || `Question ${i}`,
      difficulty: values[headers.indexOf("Difficulty")] || "Medium",
      topics: [],
    }

    // Handle URL
    const urlIndex = headers.findIndex((h) => h.toLowerCase().includes("url") || h.toLowerCase().includes("link"))
    if (urlIndex >= 0) {
      question.url = values[urlIndex]
      question.leetcode_url = values[urlIndex]
    }

    // Handle acceptance
    const acceptanceIndex = headers.findIndex((h) => h.toLowerCase().includes("acceptance"))
    if (acceptanceIndex >= 0) {
      question.acceptance = values[acceptanceIndex]
    }

    // Handle premium
    const premiumIndex = headers.findIndex((h) => h.toLowerCase().includes("premium"))
    if (premiumIndex >= 0) {
      question.isPremium = values[premiumIndex]?.toLowerCase() === "true"
    }

    // Handle frequency
    const frequencyIndex = headers.findIndex((h) => h.toLowerCase().includes("frequency"))
    if (frequencyIndex >= 0) {
      question.frequency = Number.parseInt(values[frequencyIndex]) || 0
    }

    // Handle topics
    const topicsIndex = headers.findIndex((h) => h.toLowerCase().includes("topic"))
    if (topicsIndex >= 0 && values[topicsIndex]) {
      question.topics = values[topicsIndex]
        .split(";")
        .map((t) => t.trim())
        .filter((t) => t)
    }

    questions.push(question)

    // Count difficulties
    difficultyCount[question.difficulty] = (difficultyCount[question.difficulty] || 0) + 1

    // Count topics
    question.topics.forEach((topic) => {
      topicCount[topic] = (topicCount[topic] || 0) + 1
    })
  }

  const difficulties = Object.entries(difficultyCount).map(([level, count]) => ({ level, count }))
  const topTopics = Object.entries(topicCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  return {
    questions,
    totalQuestions: questions.length,
    difficulties,
    topTopics,
  }
}
