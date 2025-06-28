"use client"

import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import type { Question } from "@/types/question"

interface QuestionsTableProps {
  questions: Question[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({ questions, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell align="left">Topics</TableCell>
            <TableCell align="left">Difficulty</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {question.question}
              </TableCell>
              <TableCell align="left">
                {question.topics.slice(0, 2).map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                {question.topics.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{question.topics.slice(2).length} more
                  </Badge>
                )}
              </TableCell>
              <TableCell align="left">{question.difficulty}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={() => onEdit(question.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={() => onDelete(question.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default QuestionsTable
