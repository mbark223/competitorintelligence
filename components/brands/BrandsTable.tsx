'use client'

import { useState, useEffect } from 'react'
import { Brand } from '@/types/airtable'

interface BrandsTableProps {
  onEdit: (brand: Brand) => void
  onDelete: (brandId: string) => void
  refreshTrigger?: number
}

export default function BrandsTable({ onEdit, onDelete, refreshTrigger }: BrandsTableProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [refreshTrigger])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/brands')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch brands')
      }

      setBrands(data.data)
    } catch (err) {
      console.error('Error fetching brands:', err)
      setError(err instanceof Error ? err.message : 'Failed to load brands')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (brandId: string, brandName: string) => {
    if (!confirm(`Are you sure you want to delete "${brandName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingId(brandId)

      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete brand')
      }

      // Remove from local state
      setBrands(brands.filter(b => b.recordId !== brandId))
      onDelete(brandId)
    } catch (err) {
      console.error('Error deleting brand:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete brand')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading brands...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error loading brands</p>
            <p className="text-gray-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchBrands}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <p className="text-gray-600">No brands found. Create your first brand to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Brand Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Facebook Page URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {brands.map((brand) => (
            <tr key={brand.recordId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{brand.brandName}</div>
              </td>
              <td className="px-6 py-4">
                <a
                  href={brand.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-md"
                >
                  {brand.facebookPageUrl}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(brand.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(brand)}
                  className="text-blue-600 hover:text-blue-900"
                  disabled={deletingId === brand.recordId}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(brand.recordId, brand.brandName)}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deletingId === brand.recordId}
                >
                  {deletingId === brand.recordId ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
