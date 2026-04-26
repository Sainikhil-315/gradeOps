import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

/**
 * AnswerImagePane - Displays student answer images/pages for grading
 * Memoized for performance
 */
function AnswerImagePane({ grade }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(100)

  if (!grade?.answer_images || grade.answer_images.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No answer images available</p>
      </div>
    )
  }

  const images = grade.answer_images
  const currentImage = images[currentPage]

  const handlePrevious = () => {
    setCurrentPage(Math.max(0, currentPage - 1))
  }

  const handleNext = () => {
    setCurrentPage(Math.min(images.length - 1, currentPage + 1))
  }

  const handleZoomIn = () => {
    setZoom(Math.min(200, zoom + 10))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(50, zoom - 10))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {currentPage + 1} of {images.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        {currentImage ? (
          <img
            src={currentImage}
            alt={`Answer page ${currentPage + 1}`}
            className="transition-transform"
            style={{ transform: `scale(${zoom / 100})` }}
          />
        ) : (
          <div className="text-gray-600 dark:text-gray-400">Loading image...</div>
        )}
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            title="Previous page (K)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentPage
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                title={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === images.length - 1}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            title="Next page (J)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default React.memo(AnswerImagePane)
