import React from 'react'
import Sidebar from './ui/Sidebar'

/**
 * Layout wrapper for authenticated pages
 * Includes sidebar navigation and content area
 */
export default function Layout({ children, className = '' }) {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={`flex-1 overflow-auto ${className}`}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
