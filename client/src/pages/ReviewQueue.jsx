import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ReviewCard from '../components/dashboard/ReviewCard'
import KeyboardShortcuts from '../components/dashboard/KeyboardShortcuts'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { useGradeQueue } from '../hooks/useGradeQueue'
import { useGradeStore } from '../store/gradeStore'
import { useToast } from '../hooks'

export default function ReviewQueue() {
  const [searchParams] = useSearchParams()
  const examId = searchParams.get('exam_id')
  const toast = useToast()

  const {
    gradeQueue,
    currentGrade,
    currentIndex,
    isLoading,
    nextGrade,
    previousGrade,
    approve,
    override,
    hasNext,
    hasPrev,
    progress,
  } = useGradeQueue(examId)

  const { totalPending, totalApproved, totalOverridden } = useGradeStore((state) => ({
    totalPending: state.totalPending,
    totalApproved: state.totalApproved,
    totalOverridden: state.totalOverridden,
  }))

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        nextGrade()
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        previousGrade()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (currentGrade) approve()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentGrade, nextGrade, previousGrade, approve])

  const stats = [
    {
      label: 'Pending Review',
      value: totalPending,
      icon: Clock,
      color: 'bg-yellow-100 dark:bg-yellow-900',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Approved',
      value: totalApproved,
      icon: CheckCircle,
      color: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Overridden',
      value: totalOverridden,
      icon: XCircle,
      color: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400',
    },
  ]

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4\">Loading grades...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Review Queue
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and approve AI-generated grades. Press <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">?</kbd> for shortcuts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grading Interface */}
        {gradeQueue.length > 0 ? (
          <ReviewCard
            grade={currentGrade}
            onApprove={approve}
            onOverride={override}
            onNext={nextGrade}
            onPrevious={previousGrade}
            hasNext={hasNext}
            hasPrev={hasPrev}
            progress={progress}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              All Grades Reviewed!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              There are no pending grades to review. Great work!
            </p>
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcuts />
      </div>
    </Layout>
  )
}