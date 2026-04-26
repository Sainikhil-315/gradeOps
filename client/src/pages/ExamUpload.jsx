import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { Upload, FileText, Plus, Trash2, ArrowRight } from 'lucide-react'
import { submissionsAPI, examsAPI } from '../api'
import { useToast } from '../hooks'

export default function ExamUpload() {
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef(null)

  const [examTitle, setExamTitle] = useState('')
  const [files, setFiles] = useState([])
  const [uploadingFileIndex, setUploadingFileIndex] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})
  const [isCreatingExam, setIsCreatingExam] = useState(false)
  const [newExamId, setNewExamId] = useState(null)
  const [step, setStep] = useState(1) // 1: Create exam, 2: Upload files, 3: Rubric

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    addFiles(selectedFiles)
  }

  const addFiles = (newFiles) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf')
    if (pdfFiles.length !== newFiles.length) {
      toast.error('Only PDF files are supported')
    }
    if (pdfFiles.length > 0) {
      setFiles([...files, ...pdfFiles])
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const createExam = async () => {
    if (!examTitle.trim()) {
      toast.error('Please enter exam title')
      return
    }

    setIsCreatingExam(true)
    try {
      const response = await examsAPI.createExam(examTitle)
      setNewExamId(response.id)
      toast.success('Exam created! Now upload PDFs.')
      setStep(2)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create exam')
    } finally {
      setIsCreatingExam(false)
    }
  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('No files to upload')
      return
    }

    for (let i = 0; i < files.length; i++) {
      setUploadingFileIndex(i)
      try {
        await submissionsAPI.uploadSubmission(newExamId, files[i])
        setUploadProgress((prev) => ({ ...prev, [i]: 100 }))
      } catch (error) {
        toast.error(`Failed to upload ${files[i].name}`)
        setUploadProgress((prev) => ({ ...prev, [i]: 'error' }))
      }
    }

    setUploadingFileIndex(null)
    toast.success('All files uploaded!')
    setStep(3)
  }

  const goToRubric = () => {
    navigate(`/rubric/${newExamId}`)
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upload Exams
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create an exam and upload PDF files for grading.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: 'Create Exam' },
            { num: 2, label: 'Upload PDFs' },
            { num: 3, label: 'Setup Rubric' },
          ].map((item, idx, arr) => (
            <div key={item.num} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= item.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.num}
              </div>
              <p
                className={`ml-2 text-sm font-medium ${
                  step >= item.num
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.label}
              </p>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step > item.num ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Create Exam */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Step 1: Create Exam
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exam Title
              </label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="e.g., CS101 Midterm Exam"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={createExam}
              disabled={isCreatingExam}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {isCreatingExam ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        )}

        {/* Step 2: Upload PDFs */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center cursor-pointer hover:border-blue-500 transition"
            >
              <Upload className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload PDF Files
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Drag and drop your exam PDFs here, or click below to browse.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
              >
                Select Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                Supported format: PDF, max 50MB per file
              </p>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      {uploadProgress[index] !== undefined ? (
                        <div className="ml-4 flex-shrink-0">
                          {uploadProgress[index] === 'error' ? (
                            <span className="text-red-600 dark:text-red-400 text-sm">Error</span>
                          ) : uploadProgress[index] === 100 ? (
                            <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                          ) : (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {uploadProgress[index]}%
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {uploadingFileIndex === null && files.length > 0 && (
                  <button
                    onClick={uploadFiles}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload All Files
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Rubric Setup */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="py-12">
              <FileText className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Files Uploaded Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {files.length} PDF files have been uploaded. Now let's set up your rubric.
              </p>
              <button
                onClick={goToRubric}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                Setup Rubric
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
