'use client'

import { useState } from 'react'
import BrandsTable from '@/components/brands/BrandsTable'
import AddBrandModal from '@/components/brands/AddBrandModal'
import EditBrandModal from '@/components/brands/EditBrandModal'
import { Brand } from '@/types/airtable'

export default function BrandsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleDeleteSuccess = () => {
    // Table handles deletion internally, but we can trigger refresh if needed
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Management</h1>
          <p className="text-gray-600">Manage competitor brands to monitor</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Brand
        </button>
      </div>

      {/* Brands Table */}
      <BrandsTable
        onEdit={handleEditClick}
        onDelete={handleDeleteSuccess}
        refreshTrigger={refreshTrigger}
      />

      {/* Modals */}
      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditBrandModal
        isOpen={isEditModalOpen}
        brand={selectedBrand}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedBrand(null)
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Getting Started Guide */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Getting Started with Brands</h2>
        <div className="space-y-3 text-blue-800 text-sm">
          <div>
            <strong>Step 1:</strong> Find your competitor's Facebook page and go to the Facebook Ad Library
          </div>
          <div>
            <strong>Step 2:</strong> Search for the brand and copy the "See all ads" URL
          </div>
          <div>
            <strong>Step 3:</strong> Click "Add Brand" above and paste the URL
          </div>
          <div>
            <strong>Step 4:</strong> Use the brand when creating ad fetch jobs to monitor their ads
          </div>
        </div>
      </div>
    </main>
  )
}
