import React from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * PlagiarismFlag - Displays plagiarism detection results
 * Memoized for performance
 */
function PlagiarismFlag({ grade }) {
  if (!grade?.plagiarism_score) {
    return null
  }

  const score = grade.plagiarism_score
  const isFlagged = score > 0.7
  const isProbable = score > 0.5

  const getRiskLevel = () => {
    if (score > 0.8) return 'critical'
    if (score > 0.7) return 'high'
    if (score > 0.5) return 'medium'
    return 'low'
  }

  const getRiskColor = () => {
    const level = getRiskLevel()
    switch (level) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
      default:
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    }
  }

  const getRiskLabel = () => {
    const level = getRiskLevel()
    switch (level) {
      case 'critical':
        return 'Critical Risk'
      case 'high':
        return 'High Risk'
      case 'medium':
        return 'Medium Risk'
      default:
        return 'Low Risk'
    }
  }

  return (
    <div className={`rounded-lg border p-4 flex items-start gap-3 ${getRiskColor()}`}>
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">Plagiarism Detection</p>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Similarity: {(score * 100).toFixed(1)}%</span>
            <span className="text-xs font-semibold">{getRiskLabel()}</span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isFlagged ? 'bg-red-600' : isProbable ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(score * 100, 100)}%` }}
            />
          </div>
        </div>
        {isFlagged && (
          <p className="text-xs mt-2 font-medium">
            ⚠️ This submission may contain plagiarized content. Review carefully.
          </p>
        )}
      </div>
    </div>
  )
}

export default React.memo(PlagiarismFlag)
