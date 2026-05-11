import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Download,
  ClipboardCheck,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Cpu,
  GraduationCap,
  BookOpen,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useDarkMode } from '../../hooks/useDarkMode'

/* ── Workflow steps shown in sidebar ── */
const WORKFLOW_STEPS = [
  { num: 1, label: 'Publish Exam',    icon: Upload,         instructor: true,  ta: false },
  { num: 2, label: 'Setup Rubric',    icon: BookOpen,       instructor: true,  ta: false },
  { num: 3, label: 'AI Processing',  icon: Cpu,            instructor: false, ta: false, system: true },
  { num: 4, label: 'TA Review',      icon: ClipboardCheck, instructor: false, ta: true  },
  { num: 5, label: 'Export Grades',  icon: Download,       instructor: true,  ta: false },
]

const INSTRUCTOR_NAV = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Upload Exam',  icon: Upload,          path: '/upload'    },
  { label: 'Export Grades',icon: Download,        path: '/export'    },
]

const TA_NAV = [
  { label: 'Review Queue', icon: ClipboardCheck,  path: '/review'    },
]

export default function Sidebar() {
  const navigate    = useNavigate()
  const location    = useLocation()
  const { user, logout, role } = useAuthStore()
  const { isDark, toggle } = useDarkMode()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = role === 'instructor' ? INSTRUCTOR_NAV : TA_NAV
  const isActive = (path) => location.pathname.startsWith(path)

  const initials = user?.email?.[0]?.toUpperCase() ?? '?'
  const roleLabel = role === 'instructor' ? 'Instructor' : 'Teaching Assistant'

  /* ── Active workflow step detection ── */
  const activeStep = (() => {
    const p = location.pathname
    if (p.startsWith('/upload'))    return 1
    if (p.startsWith('/rubric'))    return 2
    if (p.startsWith('/review'))    return 4
    if (p.startsWith('/export'))    return 5
    return 0
  })()

  const SidebarContent = () => (
    <div style={{
      width: 260,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(13,19,34,0.95)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 40,
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: '24px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 17, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              GradeOps
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-faint)', marginTop: 1 }}>
              AI Grading System
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          color: 'var(--color-text-faint)', textTransform: 'uppercase',
          padding: '4px 8px', marginBottom: 8,
        }}>
          Navigation
        </p>

        {navItems.map(item => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 4,
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                background: active
                  ? 'rgba(99,102,241,0.15)'
                  : 'transparent',
                color: active ? '#a5b4fc' : 'var(--color-text-muted)',
                borderLeft: active ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 150ms ease',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#f1f5f9' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' } }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>
          )
        })}

        {/* ── Workflow Pipeline ── */}
        <div style={{ marginTop: 24 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--color-text-faint)', textTransform: 'uppercase',
            padding: '4px 8px', marginBottom: 12,
          }}>
            Workflow Pipeline
          </p>

          <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {WORKFLOW_STEPS.map((step, idx) => {
              const isCurrentStep = activeStep === step.num
              const isPast = activeStep > step.num
              const isSystem = step.system

              return (
                <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {/* Line + dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 24, height: 24,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                      background: isCurrentStep
                        ? 'linear-gradient(135deg,#6366f1,#818cf8)'
                        : isPast
                        ? 'rgba(16,185,129,0.2)'
                        : isSystem
                        ? 'rgba(59,130,246,0.15)'
                        : 'rgba(255,255,255,0.06)',
                      color: isCurrentStep
                        ? '#fff'
                        : isPast
                        ? '#6ee7b7'
                        : isSystem
                        ? '#93c5fd'
                        : 'var(--color-text-faint)',
                      border: isCurrentStep ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isCurrentStep ? '0 0 10px rgba(99,102,241,0.4)' : 'none',
                      flexShrink: 0,
                    }}>
                      {isPast ? '✓' : step.num}
                    </div>
                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <div style={{
                        width: 1,
                        height: 20,
                        background: isPast ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)',
                        margin: '2px 0',
                      }} />
                    )}
                  </div>

                  {/* Label */}
                  <div style={{ paddingTop: 3, paddingBottom: idx < WORKFLOW_STEPS.length - 1 ? 20 : 0 }}>
                    <p style={{
                      fontSize: 12,
                      fontWeight: isCurrentStep ? 600 : 400,
                      color: isCurrentStep
                        ? '#a5b4fc'
                        : isPast
                        ? '#6ee7b7'
                        : isSystem
                        ? '#93c5fd'
                        : 'var(--color-text-faint)',
                    }}>
                      {step.label}
                    </p>
                    {isSystem && (
                      <p style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>Automatic</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* User info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          marginBottom: 8,
        }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-faint)', marginTop: 1 }}>{roleLabel}</p>
          </div>
        </div>

        {/* Theme + logout row */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={toggle}
            style={{
              flex: 1, padding: '8px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent', color: 'var(--color-text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, fontSize: 12,
              fontFamily: 'Inter, sans-serif', transition: 'all 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f1f5f9' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
            title="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              flex: 1, padding: '8px', borderRadius: 8,
              border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.06)', color: '#fca5a5',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, fontSize: 12,
              fontFamily: 'Inter, sans-serif', transition: 'all 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 50,
          display: 'none',
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg,#6366f1,#818cf8)',
          border: 'none', color: '#fff', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
        }}
        className="lg-hidden-flex"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 35, backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (always visible desktop, conditional mobile) */}
      <SidebarContent />

      {/* Spacer so content doesn't go under sidebar */}
      <div style={{ width: 260, flexShrink: 0 }} />
    </>
  )
}
