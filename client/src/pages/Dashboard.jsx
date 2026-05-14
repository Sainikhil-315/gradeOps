import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Plus, BarChart3, FileText, Clock, ChevronRight, Upload, BookOpen, Cpu, ClipboardCheck, Download, Zap, TrendingUp, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { examsAPI } from '../api'
import { useToast } from '../hooks'
import { useAuthStore } from '../store/authStore'

const STATUS_CONFIG = {
  draft:      { label: 'Draft',       color: '#64748b', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)' },
  processing: { label: 'Processing',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'  },
  ready:      { label: 'In Review',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  complete:   { label: 'Complete',    color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
}

const PIPELINE_STEPS = [
  { icon: Upload,         label: 'Publish',    sub: 'Exam + PDFs',       color: '#6366f1' },
  { icon: BookOpen,       label: 'Rubric',     sub: 'Grading criteria',  color: '#8b5cf6' },
  { icon: Cpu,            label: 'AI Grading', sub: 'OCR + LangGraph',   color: '#3b82f6' },
  { icon: ClipboardCheck, label: 'TA Review',  sub: 'Approve/Override',  color: '#f59e0b' },
  { icon: Download,       label: 'Export',     sub: 'CSV / PDF',         color: '#10b981' },
]

const MOCK_EXAMS = [
  { id: '1', title: 'Midterm Exam – CS101', status: 'ready',      submissions: 45, graded: 32, created_at: '2024-04-15' },
  { id: '2', title: 'Final Exam – CS101',   status: 'processing', submissions: 48, graded: 12, created_at: '2024-04-20' },
  { id: '3', title: 'Quiz 3 – CS201',       status: 'complete',   submissions: 30, graded: 30, created_at: '2024-04-10' },
]

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuthStore()

  const [exams, setExams] = useState(MOCK_EXAMS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    setIsLoading(true)
    try {
      const data = await examsAPI.listExams()
      if (data?.exams?.length > 0) {
        setExams(data.exams)
      } else {
        setExams([])
      }
    } catch {
      // use mock data on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? All submissions and grades will be permanently lost.')) return
    
    try {
      await examsAPI.deleteExam(examId)
      toast.success('Exam deleted successfully')
      loadExams()
    } catch (error) {
      toast.error('Failed to delete exam')
    }
  }

  const totalSubmissions = exams.reduce((s, e) => s + (e.submissions || 0), 0)
  const totalGraded      = exams.reduce((s, e) => s + (e.graded || 0), 0)
  const pendingReview    = exams.filter(e => e.status === 'ready').reduce((s, e) => s + ((e.submissions || 0) - (e.graded || 0)), 0)

  const stats = [
    { label: 'Total Exams',       value: exams.length,   icon: FileText,   gradient: 'linear-gradient(135deg,#6366f1,#818cf8)', glow: 'rgba(99,102,241,0.3)'  },
    { label: 'Pending Review',    value: pendingReview || 0,  icon: Clock,      gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)', glow: 'rgba(245,158,11,0.3)'  },
    { label: 'Total Submissions', value: totalSubmissions || 0,icon: BarChart3, gradient: 'linear-gradient(135deg,#10b981,#34d399)', glow: 'rgba(16,185,129,0.3)'  },
    { label: 'Graded',           value: totalGraded || 0,    icon: TrendingUp, gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)', glow: 'rgba(59,130,246,0.3)'  },
  ]

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, animation: 'slideUp 0.4s ease forwards' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulseDot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live Dashboard</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Instructor Dashboard
            </h1>
            <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Here's your grading overview.
            </p>
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="btn btn-primary"
            style={{ gap: 8 }}
          >
            <Plus size={17} />
            New Exam
          </button>
        </div>

        {/* ── Workflow Pipeline Banner ── */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={16} color="#6366f1" />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Grading Pipeline
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
            {PIPELINE_STEPS.map((step, idx) => (
              <React.Fragment key={step.label}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, minWidth: 90, flexShrink: 0,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${step.color}1a`,
                    border: `1px solid ${step.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <step.icon size={20} color={step.color} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{step.label}</p>
                    <p style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{step.sub}</p>
                  </div>
                </div>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: 1, minWidth: 20,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(99,102,241,0.2), rgba(255,255,255,0.1))',
                    margin: '0 4px', marginBottom: 24,
                    position: 'relative',
                  }}>
                    <ChevronRight size={14} color="#4f4f6f" style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card"
              style={{ animation: `slideUp 0.4s ease ${i * 0.08}s forwards`, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>{stat.label}</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{stat.value}</p>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: stat.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 12px ${stat.glow}`,
                }}>
                  <stat.icon size={20} color="#fff" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Exams Table ── */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Recent Exams</h2>
            <button
              onClick={() => navigate('/upload')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6366f1', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Plus size={14} /> Add Exam
            </button>
          </div>

          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#475569' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14 }}>Loading exams…</p>
            </div>
          ) : exams.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <FileText size={48} color="#1e293b" style={{ margin: '0 auto 16px', display: 'block' }} />
              <p style={{ color: '#475569', fontSize: 14 }}>No exams yet. Create your first exam to get started.</p>
              <button onClick={() => navigate('/upload')} className="btn btn-primary" style={{ marginTop: 16 }}>
                <Plus size={16} /> Create Exam
              </button>
            </div>
          ) : (
            <div>
              {/* Header row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px 100px 160px',
                padding: '10px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                {['Exam', 'Submissions', 'Graded', 'Status', 'Actions'].map(h => (
                  <p key={h} style={{ fontSize: 11, fontWeight: 700, color: '#334155', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</p>
                ))}
              </div>

              {exams.map((exam, i) => {
                const cfg = STATUS_CONFIG[exam.status] || STATUS_CONFIG.draft
                const pct = exam.submissions > 0 ? Math.round((exam.graded / exam.submissions) * 100) : 0
                return (
                  <div
                    key={exam.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 120px 120px 100px 160px',
                      padding: '16px 24px',
                      alignItems: 'center',
                      borderBottom: i < exams.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 150ms ease',
                      animation: `slideUp 0.4s ease ${i * 0.07}s forwards`,
                      opacity: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Title */}
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{exam.title}</p>
                      <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                        Created {new Date(exam.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Submissions */}
                    <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>{exam.submissions || 0}</p>

                    {/* Graded with progress */}
                    <div>
                      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4, fontWeight: 500 }}>
                        {exam.graded || 0} <span style={{ color: '#475569', fontWeight: 400 }}>/ {exam.submissions || 0}</span>
                      </p>
                      <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#818cf8)', borderRadius: 4 }} />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: 9999,
                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                        color: cfg.color, fontSize: 12, fontWeight: 600,
                      }}>
                        {exam.status === 'processing' && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulseDot 1.5s ease-in-out infinite', display: 'inline-block' }} />
                        )}
                        {cfg.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => navigate(`/upload/${exam.id}`)}
                        style={{
                          padding: '5px 10px', borderRadius: 7,
                          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                          color: '#93c5fd', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          transition: 'all 150ms ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
                        title="Upload Submissions"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => navigate(`/rubric/${exam.id}`)}
                        style={{
                          padding: '5px 10px', borderRadius: 7,
                          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                          color: '#a78bfa', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          transition: 'all 150ms ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                        title="Setup Rubric"
                      >
                        Rubric
                      </button>
                      <button
                        onClick={() => navigate(`/export/${exam.id}`)}
                        style={{
                          padding: '5px 10px', borderRadius: 7,
                          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                          color: '#6ee7b7', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          transition: 'all 150ms ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                        title="Export Grades"
                      >
                        Export
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        style={{
                          padding: '5px', borderRadius: 7,
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#fca5a5', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 150ms ease', marginLeft: 'auto'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        title="Delete Exam"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
