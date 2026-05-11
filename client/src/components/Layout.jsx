import React from 'react'
import Sidebar from './ui/Sidebar'

/**
 * Layout wrapper for authenticated pages
 */
export default function Layout({ children, className = '' }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
        className={className}
      >
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
