'use client'

import { useState } from 'react'
import CreateJobForm from '@/components/jobs/CreateJobForm'
import JobsList from '@/components/jobs/JobsList'
import JobDetailsDrawer from '@/components/jobs/JobDetailsDrawer'
import { AdFetchJob } from '@/types/airtable'

type EnhancedJob = AdFetchJob & { brandNames?: string[] }

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<EnhancedJob | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleJobCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleJobUpdated = () => {
    setRefreshTrigger(prev => prev + 1)
    setSelectedJob(null)
  }

  const handleSelectJob = (job: EnhancedJob) => {
    setSelectedJob(job)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ad Fetch Jobs</h1>
        <p className="text-gray-600">Create and monitor ad fetching jobs for your competitor brands</p>
      </div>

      {/* Create Job Form */}
      <div className="mb-8">
        <CreateJobForm onSuccess={handleJobCreated} />
      </div>

      {/* Jobs List */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Jobs</h2>
        <JobsList
          onSelectJob={handleSelectJob}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Job Details Drawer */}
      <JobDetailsDrawer
        isOpen={selectedJob !== null}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdate={handleJobUpdated}
      />

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h2>
        <div className="space-y-3 text-blue-800 text-sm">
          <div>
            <strong>1. Create a Job:</strong> Select one or more brands to monitor and enable auto-trigger to start immediately
          </div>
          <div>
            <strong>2. Monitor Progress:</strong> Jobs update automatically - watch the status change from Pending → Running → Completed
          </div>
          <div>
            <strong>3. View Results:</strong> Click any job to see details including number of ads fetched and any error messages
          </div>
          <div>
            <strong>4. Access Ads:</strong> Once complete, browse fetched ads in the <a href="/ads" className="underline">Ads Library</a>
          </div>
        </div>
      </div>
    </main>
  )
}
