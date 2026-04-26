import React, { useEffect, useState } from 'react'
import { Keyboard, X } from 'lucide-react'

/**
 * KeyboardShortcuts - Shows available keyboard shortcuts for grading
 * Memoized for performance
 */
function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: '?', action: 'Show this help' },
    { key: 'j', action: 'Next submission' },
    { key: 'k', action: 'Previous submission' },
    { key: 'Enter', action: 'Approve grade' },
    { key: 'o', action: 'Override grade' },
    { key: 'Esc', action: 'Close modal' },
  ]

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '?') {
        setIsOpen(!isOpen)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-gray-700 dark:text-gray-300 text-sm">{shortcut.action}</p>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-900 dark:text-white">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(KeyboardShortcuts)
