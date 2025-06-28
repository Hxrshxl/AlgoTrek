"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, ExternalLink, Search, Filter, RotateCcw, Crown, Hash } from "lucide-react"
import type { QuestionData } from "@/lib/types/company"

interface QuestionsTableProps {
  questions: QuestionData[]
  companySlug: string
}

export default function QuestionsTable({ questions = [], companySlug }: QuestionsTableProps) {
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(true)

  // Load completed questions from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && companySlug) {
      const saved = localStorage.getItem(`completed-${companySlug}`)
      if (saved) {
        try {
          setCompletedQuestions(new Set(JSON.parse(saved)))
        } catch (error) {
          console.error("Error loading completed questions:", error)
        }
      }
    }
  }, [companySlug])

  // Save completed questions to localStorage
  const saveCompletedQuestions = (newCompleted: Set<string>) => {
    if (typeof window !== "undefined" && companySlug) {
      localStorage.setItem(`completed-${companySlug}`, JSON.stringify(Array.from(newCompleted)))
    }
    setCompletedQuestions(newCompleted)
  }

  const toggleQuestionComplete = (questionId: string) => {
    const newCompleted = new Set(completedQuestions)
    if (newCompleted.has(questionId)) {
      newCompleted.delete(questionId)
    } else {
      newCompleted.add(questionId)
    }
    saveCompletedQuestions(newCompleted)
  }

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      saveCompletedQuestions(new Set())
    }
  }

  // Filter questions
  const filteredQuestions = useMemo(() => {
    if (!Array.isArray(questions)) return []

    return questions.filter((question) => {
      const matchesSearch =
        (question.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (question.topics || []).some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter

      const isCompleted = completedQuestions.has(question.id)
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && isCompleted) ||
        (statusFilter === "pending" && !isCompleted)

      const shouldShow = showCompleted || !isCompleted

      return matchesSearch && matchesDifficulty && matchesStatus && shouldShow
    })
  }, [questions, searchTerm, difficultyFilter, statusFilter, completedQuestions, showCompleted])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const completedCount = completedQuestions.size
  const totalQuestions = questions.length || 0
  const progressPercentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Questions (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No questions available for this company.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Questions ({filteredQuestions.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {completedCount}/{totalQuestions} completed ({progressPercentage}%)
            </span>
            <Button onClick={resetProgress} variant="ghost" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search questions or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Checkbox id="show-completed" checked={showCompleted} onCheckedChange={setShowCompleted} />
            <label htmlFor="show-completed" className="text-sm font-medium">
              Show completed
            </label>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-[100px]">Difficulty</TableHead>
                <TableHead className="w-[100px]">Acceptance</TableHead>
                <TableHead className="w-[200px]">Topics</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => {
                const isCompleted = completedQuestions.has(question.id)
                const questionTopics = question.topics || []

                return (
                  <TableRow
                    key={question.id}
                    className={`${isCompleted ? "bg-green-50 opacity-75" : ""} hover:bg-gray-50`}
                  >
                    <TableCell>
                      <Button
                        onClick={() => toggleQuestionComplete(question.id)}
                        variant={isCompleted ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          isCompleted ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50 hover:border-green-300"
                        }`}
                      >
                        {isCompleted && <Check className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{question.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isCompleted ? "line-through text-gray-500" : ""}`}>
                          {question.title || "Untitled Question"}
                        </span>
                        {question.isPremium && <Crown className="h-4 w-4 text-yellow-500" title="Premium Question" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{question.acceptance || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {questionTopics.slice(0, 2).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {questionTopics.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{questionTopics.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {question.url && (
                        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <a
                            href={
                              question.url.startsWith("http") ? question.url : `https://leetcode.com${question.url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in LeetCode"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No questions found matching your filter.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
