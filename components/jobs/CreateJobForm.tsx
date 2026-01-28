'use client'

import { useState, useEffect } from 'react'
import { Brand } from '@/types/airtable'

interface CreateJobFormProps {
  onSuccess: () => void
}

export default function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([])
  const [autoTrigger, setAutoTrigger] = useState(true)
  const [loading, setLoading] = useState(false)
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [brandsError, setBrandsError] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setBrandsLoading(true)
      setBrandsError(null)

      const response = await fetch('/api/brands')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch brands')
      }

      setBrands(data.data)
    } catch (err) {
      console.error('Error fetching brands:', err)
      setBrandsError(err instanceof Error ? err.message : 'Failed to load brands')
    } finally {
      setBrandsLoading(false)
    }
  }

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrandIds(prev => {
      if (prev.includes(brandId)) {
        return prev.filter(id => id !== brandId)
      } else {
        return [...prev, brandId]
      }
    })
  }

  const generateJobName = () => {
    const date = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    })

    const selectedBrands = brands
      .filter(b => selectedBrandIds.includes(b.recordId))
      .map(b => b.brandName)
      .join(', ')

    return `${date} - ${selectedBrands} - Ad Fetch`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (selectedBrandIds.length === 0) {
      setError('Please select at least one brand')
      return
    }

    try {
      setLoading(true)

      const jobName = generateJobName()

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: jobName,
          brandIds: selectedBrandIds,
          autoTrigger
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create job')
      }

      // Reset form
      setSelectedBrandIds([])
      setAutoTrigger(true)
      onSuccess()
    } catch (err) {
      console.error('Error creating job:', err)
      setError(err instanceof Error ? err.message : 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  if (brandsLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Job</h2>
        <div className="text-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading brands...</p>
        </div>
      </div>
    )
  }

  if (brandsError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Job</h2>
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">Failed to load brands</p>
          <p className="text-sm text-gray-600 mt-1">{brandsError}</p>
          <button
            onClick={fetchBrands}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Job</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">No brands available</p>
          <p className="text-sm text-yellow-700 mt-1">
            Please add at least one brand before creating a job.
          </p>
          <a
            href="/brands"
            className="mt-3 inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Go to Brands
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Brand Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Brands to Monitor
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {brands.map((brand) => (
              <label
                key={brand.recordId}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrandIds.includes(brand.recordId)}
                  onChange={() => handleBrandToggle(brand.recordId)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-900">{brand.brandName}</span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {selectedBrandIds.length} brand(s) selected
          </p>
        </div>

        {/* Auto-trigger Option */}
        <div>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoTrigger}
              onChange={(e) => setAutoTrigger(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
              disabled={loading}
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Auto-trigger job</span>
              <p className="text-xs text-gray-500 mt-0.5">
                Automatically start fetching ads immediately after creating the job
              </p>
            </div>
          </label>
        </div>

        {/* Job Name Preview */}
        {selectedBrandIds.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Job Name Preview:</p>
            <p className="text-sm text-gray-900 font-mono">{generateJobName()}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || selectedBrandIds.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
