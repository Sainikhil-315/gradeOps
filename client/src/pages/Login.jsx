import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../api'
import { useToast } from '../hooks'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setLoading } = useAuthStore()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [registerRole, setRegisterRole] = useState('instructor')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Email and password are required'); return }
    setIsLoading(true); setLoading(true)
    try {
      const response = await authAPI.login(email, password)
      const { access_token, user } = response
      setUser(user, access_token)
      toast.success(`Welcome back, ${user.email}!`)
      setTimeout(() => navigate(user.role === 'instructor' ? '/dashboard' : '/review'), 500)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally { setIsLoading(false); setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Email and password are required'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setIsLoading(true); setLoading(true)
    try {
      const response = await authAPI.register(email, password, registerRole)
      const { access_token, user } = response
      setUser(user, access_token)
      toast.success('Registration successful! Welcome to GradeOps!')
      setTimeout(() => navigate(registerRole === 'instructor' ? '/dashboard' : '/review'), 500)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally { setIsLoading(false); setLoading(false) }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px 11px 42px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#f1f5f9',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'all 200ms ease',
  }

  const InputField = ({ icon: Icon, type, value, onChange, placeholder, rightNode }) => (
    <div style={{ position: 'relative' }}>
      <Icon size={17} style={{
        position: 'absolute', left: 13, top: '50%',
        transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none',
      }} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isLoading}
        style={inputStyle}
        onFocus={e => {
          e.target.style.border = '1px solid #6366f1'
          e.target.style.background = 'rgba(99,102,241,0.07)'
          e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.18)'
        }}
        onBlur={e => {
          e.target.style.border = '1px solid rgba(255,255,255,0.1)'
          e.target.style.background = 'rgba(255,255,255,0.05)'
          e.target.style.boxShadow = 'none'
        }}
      />
      {rightNode && (
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {rightNode}
        </div>
      )}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Animated orbs */}
      {[
        { top: '8%',  left: '12%',  size: 360, color: 'rgba(99,102,241,0.12)',  delay: '0s'  },
        { top: '60%', left: '75%',  size: 280, color: 'rgba(139,92,246,0.1)',   delay: '2s'  },
        { top: '80%', left: '10%',  size: 200, color: 'rgba(59,130,246,0.08)',  delay: '4s'  },
        { top: '20%', left: '80%',  size: 180, color: 'rgba(236,72,153,0.07)', delay: '1s'  },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: orb.top, left: orb.left,
          width: orb.size, height: orb.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          animation: `orb-float 8s ease-in-out infinite`,
          animationDelay: orb.delay,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        position: 'relative', zIndex: 1,
        animation: 'slideUp 0.4s ease forwards',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
            marginBottom: 16,
          }}>
            <GraduationCap size={30} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 800,
            background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #6366f1 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
          }}>
            GradeOps
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
            AI-powered exam grading platform
          </p>
        </div>

        {/* Glass card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 20,
          padding: 36,
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
          }}>
            {[
              { id: 'login',    label: 'Sign In'   },
              { id: 'register', label: 'Sign Up'   },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '9px 0',
                  borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
                  transition: 'all 200ms ease',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg,#6366f1,#818cf8)'
                    : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#64748b',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
                <InputField
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
                <InputField
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  rightNode={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: 8 }}
              >
                {isLoading && <Loader2 size={18} style={{ animation: 'spinSlow 1s linear infinite' }} />}
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
                <InputField
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
                <InputField
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  rightNode={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Role</label>
                <select
                  value={registerRole}
                  onChange={e => setRegisterRole(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)', color: '#f1f5f9',
                    fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="instructor" style={{ background: '#0d1322' }}>Instructor</option>
                  <option value="ta" style={{ background: '#0d1322' }}>Teaching Assistant</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: 8 }}
              >
                {isLoading && <Loader2 size={18} style={{ animation: 'spinSlow 1s linear infinite' }} />}
                {isLoading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#334155', fontSize: 12, marginTop: 20 }}>
          Secure · AI-Powered · Academic Integrity
        </p>
      </div>
    </div>
  )
}
