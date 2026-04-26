import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Download, FileText, Sheet, FileJson, Filter } from 'lucide-react'
import { examsAPI } from '../api'
import { useToast } from '../hooks'

export default function GradeExport() {
  const toast = useToast()

  const [exams, setExams] = useState([])
  const [selectedExamId, setSelectedExamId] = useState('')
  const [format, setFormat] = useState('csv') // csv, xlsx, pdf, json
  const [includeJustification, setIncludeJustification] = useState(true)
  const [includePlagiarism, setIncludePlagiarism] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [isLoadingExams, setIsLoadingExams] = useState(true)

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      const data = await examsAPI.listExams()
      setExams(data.exams || [])
      if (data.exams?.length > 0) {
        setSelectedExamId(data.exams[0].id)
      }
    } catch (error) {
      toast.error('Failed to load exams')
    } finally {
      setIsLoadingExams(false)
    }
  }

  const handleExport = async () => {
    if (!selectedExamId) {
      toast.error('Please select an exam')
      return
    }

    setIsExporting(true)
    try {
      // In a real app, this would call the backend export endpoint
      // For now, we'll show a success message
      toast.success(`Exporting ${format.toUpperCase()} file...`)

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a mock download
      const mockData = `exam_id,student_name,marks,status\n${selectedExamId},Sample Student,85,graded`
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        `data:text/plain;charset=utf-8,${encodeURIComponent(mockData)}`
      )
      element.setAttribute('download', `grades_${selectedExamId}.${format}`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast.success(`${format.toUpperCase()} file downloaded!`)
    } catch (error) {
      toast.error('Failed to export grades')
    } finally {
      setIsExporting(false)
    }
  }

  const formatOptions = [
    {
      id: 'csv',
      label: 'CSV',
      description: 'Excel-compatible spreadsheet',
      icon: Sheet,
    },
    { id: 'xlsx', label: 'Excel', description: 'Microsoft Excel format', icon: Sheet },
    { id: 'pdf', label: 'PDF', description: 'Portable document format', icon: FileText },
    { id: 'json', label: 'JSON', description: 'Structured data format', icon: FileJson },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Export Grades
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Download grades in your preferred format with customizable options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Export Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Select Exam
              </h3>
              {isLoadingExams ? (
                <div className="text-gray-600 dark:text-gray-400">Loading exams...</div>
              ) : (
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select an exam --</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Export Format */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Export Format
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {formatOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.id}
                      onClick={() => setFormat(option.id)}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        format === option.id
                          ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mb-2 ${
                          format === option.id
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      />
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {option.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Options
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeJustification}
                    onChange={(e) => setIncludeJustification(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Include grade justifications
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePlagiarism}
                    onChange={(e) => setIncludePlagiarism(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Include plagiarism flags
                  </span>
                </label>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Date Range (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Export Preview */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Export Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Selected Exam</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {exams.find((e) => e.id === selectedExamId)?.title ||
                      'No exam selected'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Format</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {format.toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Columns</p>
                  <ul className="text-sm font-medium text-gray-900 dark:text-white space-y-1 mt-2">
                    <li>✓ Student ID</li>
                    <li>✓ Total Marks</li>
                    {includeJustification && <li>✓ Justifications</li>}
                    {includePlagiarism && <li>✓ Plagiarism Flags</li>}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting || !selectedExamId}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {isExporting ? 'Exporting...' : 'Export Now'}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
                Downloads will start automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
