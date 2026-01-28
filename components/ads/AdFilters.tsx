'use client'

import { useState, useEffect } from 'react'
import { Brand } from '@/types/airtable'

interface AdFiltersProps {
  onFilterChange: (filters: {
    brand?: string
    format?: string
    status?: string
    analyzed?: string
    search?: string
  }) => void
}

export default function AdFilters({ onFilterChange }: AdFiltersProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedFormat, setSelectedFormat] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [analyzedFilter, setAnalyzedFilter] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    // Debounce filter changes
    const timeoutId = setTimeout(() => {
      const filters: any = {}
      if (selectedBrand) filters.brand = selectedBrand
      if (selectedFormat) filters.format = selectedFormat
      if (selectedStatus) filters.status = selectedStatus
      if (analyzedFilter) filters.analyzed = analyzedFilter
      if (searchText) filters.search = searchText

      onFilterChange(filters)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [selectedBrand, selectedFormat, selectedStatus, analyzedFilter, searchText, onFilterChange])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      if (data.success) {
        setBrands(data.data)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const handleReset = () => {
    setSelectedBrand('')
    setSelectedFormat('')
    setSelectedStatus('')
    setAnalyzedFilter('')
    setSearchText('')
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search ad copy..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.recordId} value={brand.recordId}>
              {brand.brandName}
            </option>
          ))}
        </select>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format
        </label>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Formats</option>
          <option value="Video">Video</option>
          <option value="Image">Image</option>
          <option value="Carousel">Carousel</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Analyzed */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Analysis
        </label>
        <select
          value={analyzedFilter}
          onChange={(e) => setAnalyzedFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Ads</option>
          <option value="true">Analyzed Only</option>
          <option value="false">Not Analyzed</option>
        </select>
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Filters are applied automatically as you type
        </p>
      </div>
    </div>
  )
}
