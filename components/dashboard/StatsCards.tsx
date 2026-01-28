'use client'

import { useState, useEffect } from 'react'

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalAds: 0,
    activeJobs: 0,
    analyzedAds: 0,
    brandCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Ads',
      value: stats.totalAds,
      subtitle: 'Across all brands',
      color: 'text-blue-600'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      subtitle: 'Currently running',
      color: 'text-green-600'
    },
    {
      title: 'Analyzed Ads',
      value: stats.analyzedAds,
      subtitle: `${stats.totalAds > 0 ? Math.round((stats.analyzedAds / stats.totalAds) * 100) : 0}% with AI insights`,
      color: 'text-purple-600'
    },
    {
      title: 'Brands',
      value: stats.brandCount,
      subtitle: 'Being monitored',
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">{card.title}</div>
          <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-sm text-gray-500 mt-2">{card.subtitle}</div>
        </div>
      ))}
    </div>
  )
}
