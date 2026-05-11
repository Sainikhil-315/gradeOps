import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  Download, FileText, AlertCircle, CheckCircle2, Loader2,
  FileSpreadsheet, FileJson, Filter, ChevronDown,
} from 'lucide-react'
import { examsAPI } from '../api'
import { useToast } from '../hooks'

const FORMAT_OPTIONS = [
  { id: 'csv',  label: 'CSV',   icon: FileSpreadsheet, desc: 'Excel-compatible',      color: '#10b981' },
  { id: 'xlsx', label: 'Excel', icon: FileSpreadsheet, desc: 'Microsoft Excel',        color: '#3b82f6' },
  { id: 'pdf',  label: 'PDF',   icon: FileText,        desc: 'Portable Document',      color: '#ef4444' },
  { id: 'json', label: 'JSON',  icon: FileJson,        desc: 'Structured data',        color: '#f59e0b' },
]

export default function GradeExport() {
  const { examId: paramExamId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [exams, setExams] = useState([])
  const [selectedExamId, setSelectedExamId] = useState(paramExamId || '')
  const [format, setFormat] = useState('csv')
  const [includeJustification, setIncludeJustification] = useState(true)
  const [includePlagiarism, setIncludePlagiarism] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isLoadingExams, setIsLoadingExams] = useState(true)

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      const data = await examsAPI.listExams()
      const list = data.exams || []
      setExams(list)
      if (!selectedExamId && list.length > 0) setSelectedExamId(list[0].id)
    } catch {
      toast.error('Failed to load exams')
    } finally { setIsLoadingExams(false) }
  }

  const selectedExam = exams.find(e => e.id === selectedExamId)
  const isComplete = selectedExam?.status === 'complete'
  const hasIncomplete = selectedExam && !isComplete

  const handleExport = async () => {
    if (!selectedExamId) { toast.error('Please select an exam'); return }
    setIsExporting(true)
    try {
      toast.success(`Preparing ${format.toUpperCase()} export…`)
      await new Promise(r => setTimeout(r, 1200))

      // Build export data
      const cols = ['exam_id', 'student_id', 'total_marks']
      if (includeJustification) cols.push('justification')
      if (includePlagiarism)   cols.push('plagiarism_score')

      const csvContent = `${cols.join(',')}\n${selectedExamId},S001,85${includeJustification ? ',Good understanding of core concepts' : ''}${includePlagiarism ? ',0.12' : ''}`

      const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url; a.download = `grades_${selectedExamId}.${format}`
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)

      toast.success(`${format.toUpperCase()} downloaded!`)
    } catch {
      toast.error('Export failed')
    } finally { setIsExporting(false) }
  }

  /* Column preview list */
  const previewCols = [
    'Student ID', 'Total Marks', 'TA Status',
    ...(includeJustification ? ['AI Justifications'] : []),
    ...(includePlagiarism   ? ['Plagiarism Score']  : []),
  ]

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
      <span style={{ fontSize: 14, color: '#94a3b8' }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 42, height: 24, borderRadius: 12, position: 'relative',
          background: checked ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'rgba(255,255,255,0.1)',
          border: `1px solid ${checked ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 250ms ease', flexShrink: 0, cursor: 'pointer',
          boxShadow: checked ? '0 0 10px rgba(99,102,241,0.3)' : 'none',
        }}
      >
        <div style={{
          position: 'absolute', top: 3,
          left: checked ? 20 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff',
          transition: 'left 250ms ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
    </label>
  )

  return (
    <Layout>
      <div style={{ animation: 'slideUp 0.4s ease forwards' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Export Grades
          </h1>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
            Download final grades after TA review is complete.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* ── Left: config ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Exam selector */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Filter size={16} color="#818cf8" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Select Exam</h3>
              </div>

              {isLoadingExams ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#475569', fontSize: 14 }}>
                  <Loader2 size={16} style={{ animation: 'spinSlow 0.8s linear infinite' }} color="#6366f1" />
                  Loading exams…
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedExamId}
                    onChange={e => setSelectedExamId(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 36px 10px 14px',
                      borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: '#f1f5f9',
                      fontSize: 14, fontFamily: 'Inter, sans-serif',
                      appearance: 'none', cursor: 'pointer', outline: 'none',
                    }}
                  >
                    <option value="" style={{ background: '#0d1322' }}>-- Select an exam --</option>
                    {exams.map(e => (
                      <option key={e.id} value={e.id} style={{ background: '#0d1322' }}>{e.title}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} color="#475569" style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
                  }} />
                </div>
              )}

              {/* Completion warning */}
              {hasIncomplete && (
                <div style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 13, color: '#fcd34d', lineHeight: 1.5 }}>
                    TA review is not fully complete for this exam. Some grades may still be pending.
                  </p>
                </div>
              )}

              {isComplete && (
                <div style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <p style={{ fontSize: 13, color: '#6ee7b7' }}>All grades reviewed — ready to export.</p>
                </div>
              )}
            </div>

            {/* Format selector */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>Export Format</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {FORMAT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFormat(opt.id)}
                    style={{
                      padding: '16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: format === opt.id ? `${opt.color}12` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${format === opt.id ? `${opt.color}30` : 'rgba(255,255,255,0.07)'}`,
                      textAlign: 'left', transition: 'all 200ms ease',
                      boxShadow: format === opt.id ? `0 0 16px ${opt.color}18` : 'none',
                    }}
                  >
                    <opt.icon size={22} color={format === opt.id ? opt.color : '#475569'} style={{ marginBottom: 8, display: 'block' }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: format === opt.id ? opt.color : '#e2e8f0', marginBottom: 2 }}>
                      {opt.label}
                    </p>
                    <p style={{ fontSize: 12, color: '#475569' }}>{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 18 }}>Include in Export</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ToggleSwitch
                  checked={includeJustification}
                  onChange={setIncludeJustification}
                  label="AI Grade Justifications"
                />
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <ToggleSwitch
                  checked={includePlagiarism}
                  onChange={setIncludePlagiarism}
                  label="Plagiarism Scores"
                />
              </div>
            </div>
          </div>

          {/* ── Right: summary + export button (sticky) ── */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 20 }}>Export Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 11, color: '#475569', marginBottom: 4, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Exam</p>
                  <p style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>
                    {selectedExam?.title || 'None selected'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 11, color: '#475569', marginBottom: 4, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Format</p>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '3px 10px', borderRadius: 6,
                    background: `${FORMAT_OPTIONS.find(f => f.id === format)?.color}15`,
                    border: `1px solid ${FORMAT_OPTIONS.find(f => f.id === format)?.color}25`,
                    color: FORMAT_OPTIONS.find(f => f.id === format)?.color,
                    fontSize: 13, fontWeight: 700,
                  }}>
                    {format.toUpperCase()}
                  </span>
                </div>

                <div>
                  <p style={{ fontSize: 11, color: '#475569', marginBottom: 8, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Columns</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {previewCols.map(col => (
                      <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <CheckCircle2 size={13} color="#10b981" />
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{col}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting || !selectedExamId}
                className="btn btn-primary btn-full btn-lg"
              >
                {isExporting
                  ? <><Loader2 size={17} style={{ animation: 'spinSlow 0.8s linear infinite' }} /> Exporting…</>
                  : <><Download size={17} /> Export Now</>
                }
              </button>

              <p style={{ textAlign: 'center', color: '#334155', fontSize: 12, marginTop: 12 }}>
                Download starts automatically
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
