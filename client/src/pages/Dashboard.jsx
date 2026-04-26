import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { Plus, BarChart3, FileText, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useExamStore } from '../store/examStore'
import { examsAPI } from '../api'
import { useToast } from '../hooks'

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const toast = useToast()

  // Mock data - will be replaced with real data from API
  const exams = [
    {
      id: '1',
      title: 'Midterm Exam - CS101',
      status: 'ready',
      submissions: 45,
      graded: 32,
      created_at: '2024-04-15',
    },
    {
      id: '2',
      title: 'Final Exam - CS101',
      status: 'processing',
      submissions: 48,
      graded: 12,
      created_at: '2024-04-20',
    },
  ]

  const stats = [
    {
      label: 'Total Exams',
      value: exams.length,
      icon: FileText,
      color: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Pending Review',
      value: 16,
      icon: Clock,
      color: 'bg-yellow-100 dark:bg-yellow-900',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Total Submissions',
      value: 93,
      icon: BarChart3,
      color: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400',
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back! Here's your grading overview.
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            New Exam
          </button>
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

        {/* Exams List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Exams
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {exams.length > 0 ? (
              exams.map((exam) => (
                <div key={exam.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {exam.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{exam.submissions} submissions</span>
                        <span>{exam.graded} graded</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          exam.status === 'ready'
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        }`}
                      >
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600 dark:text-gray-400">
                  No exams yet. Create one to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
