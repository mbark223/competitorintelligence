'use client'

import { useState } from 'react'

interface AddBrandModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddBrandModal({ isOpen, onClose, onSuccess }: AddBrandModalProps) {
  const [formData, setFormData] = useState({
    brandName: '',
    facebookPageUrl: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitError(null)

    // Client-side validation
    const newErrors: Record<string, string> = {}

    if (!formData.brandName || formData.brandName.length < 2) {
      newErrors.brandName = 'Brand name must be at least 2 characters'
    }
    if (formData.brandName.length > 100) {
      newErrors.brandName = 'Brand name must be at most 100 characters'
    }
    if (!formData.facebookPageUrl) {
      newErrors.facebookPageUrl = 'Facebook page URL is required'
    } else if (!formData.facebookPageUrl.includes('facebook.com')) {
      newErrors.facebookPageUrl = 'Must be a Facebook URL'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        if (data.details) {
          // Validation errors from server
          const serverErrors: Record<string, string> = {}
          Object.entries(data.details).forEach(([key, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              serverErrors[key] = messages[0]
            }
          })
          setErrors(serverErrors)
        } else {
          throw new Error(data.error || 'Failed to create brand')
        }
        return
      }

      // Success - reset form and close
      setFormData({ brandName: '', facebookPageUrl: '' })
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating brand:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to create brand')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setFormData({ brandName: '', facebookPageUrl: '' })
      setErrors({})
      setSubmitError(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Brand</h2>
          <p className="text-sm text-gray-600 mt-1">Add a competitor brand to monitor</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Brand Name */}
            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.brandName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., FanDuel Casino"
                disabled={submitting}
              />
              {errors.brandName && (
                <p className="mt-1 text-sm text-red-600">{errors.brandName}</p>
              )}
            </div>

            {/* Facebook Page URL */}
            <div>
              <label htmlFor="facebookPageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                id="facebookPageUrl"
                name="facebookPageUrl"
                value={formData.facebookPageUrl}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.facebookPageUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://www.facebook.com/ads/library/?..."
                disabled={submitting}
              />
              {errors.facebookPageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.facebookPageUrl}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Paste the URL from Facebook Ad Library
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Brand'}
          </button>
        </div>
      </div>
    </div>
  )
}
