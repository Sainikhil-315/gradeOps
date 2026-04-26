import React, { useState, useMemo, useCallback } from 'react'
import { CheckCircle, Edit3, ChevronRight, ChevronLeft } from 'lucide-react'
import PlagiarismFlag from './PlagiarismFlag'
import GradeBreakdown from './GradeBreakdown'
import AnswerImagePane from './AnswerImagePane'
import { useToast } from '../../hooks'

/**
 * ReviewCard - Main card component for grading a single submission
 * Memoized for performance optimization
 */
function ReviewCard({
  grade,
  onApprove,
  onOverride,
  onNext,
  onPrevious,
  hasNext,
  hasPrev,
  progress,
}) {
  const toast = useToast()
  const [feedback, setFeedback] = useState('')
  const [isOverriding, setIsOverriding] = useState(false)
  const [overrideMarks, setOverrideMarks] = useState(grade?.marks || 0)
  const [overrideReason, setOverrideReason] = useState('')

  if (!grade) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">No submissions to grade</p>
      </div>
    )
  }

  const handleApprove = useCallback(() => {
    onApprove(feedback)
    setFeedback('')
  }, [feedback, onApprove])

  const handleOverride = useCallback(() => {
    if (overrideMarks === '' || overrideReason.trim() === '') {
      toast.error('Please fill in all override fields')
      return
    }
    onOverride(parseFloat(overrideMarks), overrideReason)
    setIsOverriding(false)
    setOverrideMarks(grade.marks)
    setOverrideReason('')
  }, [overrideMarks, overrideReason, onOverride, grade.marks, toast])

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Review Submission
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Student: {grade.student_name || 'Unknown'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{progress}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Progress</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Answer images */}
        <div className="lg:col-span-2">
          <AnswerImagePane grade={grade} />
        </div>

        {/* Right: Grade info and actions */}
        <div className="space-y-6">
          {/* Grade breakdown */}
          <GradeBreakdown grade={grade} />

          {/* Plagiarism flag */}
          {grade.plagiarism_score && <PlagiarismFlag grade={grade} />}

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            {!isOverriding ? (
              <>
                {/* Feedback textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feedback (Optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add feedback for the student..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Approve button */}
                <button
                  onClick={handleApprove}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Grade (Enter)
                </button>

                {/* Override button */}
                <button
                  onClick={() => setIsOverriding(true)}
                  className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium"
                >
                  <Edit3 className="w-5 h-5" />
                  Override Grade (O)
                </button>
              </>
            ) : (
              <>
                {/* Override form */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Marks
                  </label>
                  <input
                    type="number"
                    value={overrideMarks}
                    onChange={(e) => setOverrideMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Override
                  </label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Explain why you're overriding this grade..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>

                <button
                  onClick={handleOverride}
                  className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
                >
                  Confirm Override
                </button>

                <button
                  onClick={() => setIsOverriding(false)}
                  className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={onPrevious}
              disabled={!hasPrev}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ReviewCard, (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.grade?.id === nextProps.grade?.id &&
    prevProps.progress === nextProps.progress &&
    prevProps.hasNext === nextProps.hasNext &&
    prevProps.hasPrev === nextProps.hasPrev
  )
})
