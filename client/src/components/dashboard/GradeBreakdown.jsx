import React from 'react'
import { TrendingUp } from 'lucide-react'

/**
 * GradeBreakdown - Shows the breakdown of marks by rubric criteria
 * Memoized for performance
 */
function GradeBreakdown({ grade }) {
  if (!grade?.criteria_marks) {
    return null
  }

  const criteriaMarks = Array.isArray(grade.criteria_marks) ? grade.criteria_marks : []
  const totalMarks = grade.total_marks || criteriaMarks.reduce((sum, cm) => sum + (cm.marks || 0), 0)
  const percentage = totalMarks > 0 ? ((grade.marks || 0) / totalMarks * 100).toFixed(1) : 0

  const getGradeColor = (pct) => {
    if (pct >= 80) return 'text-green-600 dark:text-green-400'
    if (pct >= 60) return 'text-blue-600 dark:text-blue-400'
    if (pct >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getGradeLetter = (pct) => {
    if (pct >= 90) return 'A'
    if (pct >= 80) return 'B'
    if (pct >= 70) return 'C'
    if (pct >= 60) return 'D'
    return 'F'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Grade Breakdown</h3>
      </div>

      {/* Overall Score */}
      <div className="mb-6 text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-baseline justify-center gap-2">
          <span className={`text-4xl font-bold ${getGradeColor(percentage)}`}>
            {getGradeLetter(percentage)}
          </span>
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {grade.marks}/{totalMarks}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {percentage}% score
        </p>
      </div>

      {/* Criteria Breakdown */}
      {criteriaMarks.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Criteria Marks</p>
          {criteriaMarks.map((criterion, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {criterion.name || `Criterion ${index + 1}`}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {criterion.marks}/{criterion.max_marks}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all"
                  style={{
                    width: `${Math.min(
                      (criterion.marks / criterion.max_marks) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {grade.feedback && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-300 mb-2">LLM Feedback</p>
          <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
            {grade.feedback}
          </p>
        </div>
      )}
    </div>
  )
}

export default React.memo(GradeBreakdown)
