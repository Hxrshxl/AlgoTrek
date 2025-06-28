import type React from "react"
import { Card, CardBody, CardTitle, Badge } from "reactstrap"

interface CompanyStatsProps {
  employeeCount: number
  averageSalary: number
  topTopics: string[]
}

const CompanyStats: React.FC<CompanyStatsProps> = ({ employeeCount, averageSalary, topTopics }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Company Statistics</CardTitle>
        <div className="mt-3">
          <p>
            <strong>Employee Count:</strong> {employeeCount}
          </p>
          <p>
            <strong>Average Salary:</strong> ${averageSalary}
          </p>
          <p>
            <strong>Top Topics:</strong>
            {topTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </p>
        </div>
      </CardBody>
    </Card>
  )
}

export default CompanyStats
