import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { BookOpen, Plus, Trash2, Save, ArrowRight } from 'lucide-react'
import { rubricsAPI } from '../api'
import { useToast } from '../hooks'

export default function RubricSetup() {
  const navigate = useNavigate()
  const { examId } = useParams()
  const toast = useToast()

  const [title, setTitle] = useState('')
  const [totalMarks, setTotalMarks] = useState(100)
  const [criteria, setCriteria] = useState([
    { id: 1, name: '', maxMarks: 0, description: '' },
  ])
  const [nextId, setNextId] = useState(2)
  const [isSaving, setIsSaving] = useState(false)

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      { id: nextId, name: '', maxMarks: 0, description: '' },
    ])
    setNextId(nextId + 1)
  }

  const removeCriterion = (id) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((c) => c.id !== id))
    } else {
      toast.error('At least one criterion is required')
    }
  }

  const updateCriterion = (id, field, value) => {
    setCriteria(
      criteria.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    )
  }

  const getTotalMarksFromCriteria = () => {
    return criteria.reduce((sum, c) => sum + (parseInt(c.maxMarks) || 0), 0)
  }

  const saveRubric = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter rubric title')
      return
    }

    if (criteria.some((c) => !c.name.trim() || !c.maxMarks)) {
      toast.error('All criteria must have a name and marks')
      return
    }

    const criteriaTotal = getTotalMarksFromCriteria()
    if (criteriaTotal === 0) {
      toast.error('Total marks must be greater than 0')
      return
    }

    setIsSaving(true)
    try {
      const rubricData = {
        criteria: criteria.map((c) => ({
          id: c.name,  // Use name as the criterion ID
          marks: parseInt(c.maxMarks),
          description: c.description,
        })),
        max_marks: criteriaTotal,
      }

      await rubricsAPI.createRubric(examId, rubricData)
      toast.success('Rubric saved successfully!')

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      // Handle both validation errors and detail errors
      const errorMessage = error.response?.data?.detail || 
                          (Array.isArray(error.response?.data) ? 
                            error.response.data.map(e => e.msg).join(', ') :
                            'Failed to save rubric')
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const criteriaTotal = getTotalMarksFromCriteria()

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Setup Rubric
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Define grading criteria and marking scheme for your exam.
          </p>
        </div>

        {/* Rubric Builder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Rubric Title */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rubric Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., CS101 Midterm Rubric"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Criteria List */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Criteria ({criteria.length})
              </h3>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {criteriaTotal}
                </p>
              </div>
            </div>

            {criteria.map((criterion, index) => (
              <div
                key={criterion.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Criterion {index + 1}
                  </h4>
                  <button
                    onClick={() => removeCriterion(criterion.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Criterion Name
                    </label>
                    <input
                      type="text"
                      value={criterion.name}
                      onChange={(e) =>
                        updateCriterion(criterion.id, 'name', e.target.value)
                      }
                      placeholder="e.g., Problem Solving"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Max Marks
                    </label>
                    <input
                      type="number"
                      value={criterion.maxMarks}
                      onChange={(e) =>
                        updateCriterion(criterion.id, 'maxMarks', e.target.value)
                      }
                      placeholder="e.g., 25"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={criterion.description}
                    onChange={(e) =>
                      updateCriterion(criterion.id, 'description', e.target.value)
                    }
                    placeholder="Add detailed guidelines for grading this criterion..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            ))}

            {/* Add Criterion Button */}
            <button
              onClick={addCriterion}
              className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 transition flex items-center justify-center gap-2 mt-4"
            >
              <Plus className="w-5 h-5" />
              Add Criterion
            </button>
          </div>

          {/* Summary */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Criteria Count</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {criteria.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {criteriaTotal}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveRubric}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Rubric'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
