'use client'

import { useState, useEffect } from 'react'
import { AdFetchJob, JobStatus } from '@/types/airtable'

interface JobsListProps {
  onSelectJob: (job: AdFetchJob & { brandNames?: string[] }) => void
  refreshTrigger?: number
}

type EnhancedJob = AdFetchJob & { brandNames?: string[] }

export default function JobsList({ onSelectJob, refreshTrigger }: JobsListProps) {
  const [jobs, setJobs] = useState<EnhancedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'All'>('All')

  useEffect(() => {
    fetchJobs()
  }, [refreshTrigger, statusFilter])

  // Auto-refresh every 10 seconds if there are Running jobs
  useEffect(() => {
    const hasRunningJobs = jobs.some(job => job.status === 'Running')

    if (hasRunningJobs) {
      const interval = setInterval(() => {
        fetchJobs(true) // Silent refresh
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [jobs])

  const fetchJobs = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== 'All') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch jobs')
      }

      setJobs(data.data)
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const getStatusColor = (status: JobStatus) => {
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

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const statusOptions: (JobStatus | 'All')[] = ['All', 'Pending', 'Running', 'Completed', 'Failed']

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading jobs</p>
          <p className="text-gray-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => fetchJobs()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200 px-6 pt-4">
        <div className="flex space-x-4">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                statusFilter === status
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
              {status !== 'All' && (
                <span className="ml-2 text-xs">
                  ({jobs.filter(j => j.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="p-6 text-center text-gray-600">
          No jobs found. Create your first job to get started!
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <div
              key={job.recordId}
              onClick={() => onSelectJob(job)}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <strong>Brands:</strong> {job.brandNames?.join(', ') || 'N/A'}
                    </p>

                    {job.adsCount !== undefined && (
                      <p className="text-sm text-gray-600">
                        <strong>Ads Fetched:</strong> {job.adsCount}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      Created: {formatDate(job.createdAt)}
                    </p>

                    {job.completedAt && (
                      <p className="text-sm text-gray-500">
                        Completed: {formatDate(job.completedAt)}
                      </p>
                    )}

                    {job.errorMessage && (
                      <p className="text-sm text-red-600 mt-2">
                        Error: {job.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  {job.status === 'Running' && (
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
