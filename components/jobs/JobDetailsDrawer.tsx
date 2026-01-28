'use client'

import { useState, useEffect } from 'react'
import { AdFetchJob } from '@/types/airtable'

interface JobDetailsDrawerProps {
  isOpen: boolean
  job: (AdFetchJob & { brandNames?: string[] }) | null
  onClose: () => void
  onUpdate: () => void
}

export default function JobDetailsDrawer({ isOpen, job, onClose, onUpdate }: JobDetailsDrawerProps) {
  const [triggering, setTriggering] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !job) return null

  const handleTriggerNow = async () => {
    setError(null)
    setTriggering(true)

    try {
      const response = await fetch(`/api/jobs/${job.recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ triggerNow: true })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to trigger job')
      }

      onUpdate()
    } catch (err) {
      console.error('Error triggering job:', err)
      setError(err instanceof Error ? err.message : 'Failed to trigger job')
    } finally {
      setTriggering(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this job? This action cannot be undone.`)) {
      return
    }

    setError(null)
    setDeleting(true)

    try {
      const response = await fetch(`/api/jobs/${job.recordId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete job')
      }

      onUpdate()
      onClose()
    } catch (err) {
      console.error('Error deleting job:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete job')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-100 text-gray-800'
      case 'Running':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
              <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Job Name */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Job Name</h3>
            <p className="text-gray-900">{job.name}</p>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Monitored Brands</h3>
            <div className="space-y-1">
              {job.brandNames && job.brandNames.length > 0 ? (
                job.brandNames.map((brandName, index) => (
                  <div key={index} className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-900">
                    {brandName}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No brands linked</p>
              )}
            </div>
          </div>

          {/* Ads Fetched */}
          {job.adsCount !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ads Fetched</h3>
              <p className="text-2xl font-bold text-gray-900">{job.adsCount}</p>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900 font-medium">{formatDate(job.createdAt)}</span>
              </div>
              {job.startedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Started:</span>
                  <span className="text-gray-900 font-medium">{formatDate(job.startedAt)}</span>
                </div>
              )}
              {job.completedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <span className="text-gray-900 font-medium">{formatDate(job.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {job.errorMessage && (
            <div>
              <h3 className="text-sm font-medium text-red-600 mb-1">Error</h3>
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">{job.errorMessage}</p>
              </div>
            </div>
          )}

          {/* Record ID */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Record ID</h3>
            <p className="text-xs text-gray-600 font-mono">{job.recordId}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          {/* Trigger Now Button - only show for Pending or Failed jobs */}
          {(job.status === 'Pending' || job.status === 'Failed') && (
            <button
              onClick={handleTriggerNow}
              disabled={triggering}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {triggering ? 'Triggering...' : 'Trigger Now'}
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={deleting || job.status === 'Running'}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete Job'}
          </button>

          {job.status === 'Running' && (
            <p className="text-xs text-gray-500 text-center">
              Cannot delete a running job
            </p>
          )}
        </div>
      </div>
    </>
  )
}
