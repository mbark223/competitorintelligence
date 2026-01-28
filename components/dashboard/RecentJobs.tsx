'use client'

import { useState, useEffect } from 'react'
import { AdFetchJob } from '@/types/airtable'
import Link from 'next/link'

type EnhancedJob = AdFetchJob & { brandNames?: string[] }

export default function RecentJobs() {
  const [jobs, setJobs] = useState<EnhancedJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?limit=5')
      const data = await response.json()

      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error('Error fetching recent jobs:', error)
    } finally {
      setLoading(false)
    }
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

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Jobs</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Jobs</h2>
        <p className="text-gray-600 text-sm">
          No jobs yet. <Link href="/jobs" className="text-blue-600 hover:underline">Create your first job</Link> to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
        <Link href="/jobs" className="text-sm text-blue-600 hover:text-blue-800">
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Link
            key={job.recordId}
            href="/jobs"
            className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {job.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {job.brandNames?.join(', ')} • {formatDate(job.createdAt)}
                  {job.adsCount !== undefined && ` • ${job.adsCount} ads`}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
