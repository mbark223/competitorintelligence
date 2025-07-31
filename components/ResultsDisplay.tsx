'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TargetingResults } from '@/types/targeting'
import { Hash, Users, Layers, Download, Copy, Check } from 'lucide-react'
import { exportToCSV, copyToClipboard } from '@/lib/export'

interface ResultsDisplayProps {
  results: TargetingResults
}

type TabType = 'keywords' | 'influencers' | 'interests'

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  const tabs = [
    { id: 'keywords' as TabType, label: 'Keywords', icon: Hash, count: results.keywords.length },
    { id: 'influencers' as TabType, label: 'Influencers', icon: Users, count: results.influencers.length },
    { id: 'interests' as TabType, label: 'Interest Categories', icon: Layers, count: results.interestCategories.length },
  ]

  const handleSelectAll = () => {
    const allItems = new Set<string>()
    
    if (activeTab === 'keywords') {
      results.keywords.forEach(k => allItems.add(k.text))
    } else if (activeTab === 'influencers') {
      results.influencers.forEach(i => allItems.add(i.handle))
    } else if (activeTab === 'interests') {
      results.interestCategories.forEach(c => allItems.add(c.id))
    }
    
    setSelectedItems(allItems)
  }

  const handleDeselectAll = () => {
    setSelectedItems(new Set())
  }

  const handleItemToggle = (item: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(item)) {
      newSelected.delete(item)
    } else {
      newSelected.add(item)
    }
    setSelectedItems(newSelected)
  }

  const handleCopyItem = async (item: string) => {
    await copyToClipboard(item)
    setCopiedItems(new Set([...copiedItems, item]))
    setTimeout(() => {
      setCopiedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item)
        return newSet
      })
    }, 2000)
  }

  const handleExportSelected = () => {
    const dataToExport = {
      keywords: activeTab === 'keywords' ? results.keywords.filter(k => selectedItems.has(k.text)) : [],
      influencers: activeTab === 'influencers' ? results.influencers.filter(i => selectedItems.has(i.handle)) : [],
      interests: activeTab === 'interests' ? results.interestCategories.filter(c => selectedItems.has(c.id)) : [],
    }
    
    exportToCSV(dataToExport, `twitter-targeting-${activeTab}-${Date.now()}`)
  }

  const handleCopySelected = async () => {
    const items = Array.from(selectedItems).join('\n')
    await copyToClipboard(items)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Generated Targeting</h2>
        <p className="text-gray-600 text-sm">
          Generated at {new Date(results.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Select All
          </button>
          <button
            onClick={handleDeselectAll}
            className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Deselect All
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopySelected}
            disabled={selectedItems.size === 0}
            className="flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 text-blue-700 rounded-md transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Selected
          </button>
          <button
            onClick={handleExportSelected}
            disabled={selectedItems.size === 0}
            className="flex items-center gap-2 text-sm px-3 py-1.5 bg-green-100 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 text-green-700 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-2 max-h-96 overflow-y-auto"
        >
          {activeTab === 'keywords' && (
            <KeywordsList
              keywords={results.keywords}
              negativeKeywords={results.negativeKeywords}
              selectedItems={selectedItems}
              copiedItems={copiedItems}
              onToggle={handleItemToggle}
              onCopy={handleCopyItem}
            />
          )}
          
          {activeTab === 'influencers' && (
            <InfluencersList
              influencers={results.influencers}
              selectedItems={selectedItems}
              copiedItems={copiedItems}
              onToggle={handleItemToggle}
              onCopy={handleCopyItem}
            />
          )}
          
          {activeTab === 'interests' && (
            <InterestsList
              interests={results.interestCategories}
              selectedItems={selectedItems}
              copiedItems={copiedItems}
              onToggle={handleItemToggle}
              onCopy={handleCopyItem}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function KeywordsList({ keywords, negativeKeywords, selectedItems, copiedItems, onToggle, onCopy }: any) {
  const groupedKeywords = keywords.reduce((acc: any, kw: any) => {
    const category = kw.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(kw)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(groupedKeywords).map(([category, categoryKeywords]: [string, any]) => (
        <div key={category}>
          <h3 className="font-medium text-gray-700 mb-2">{category}</h3>
          <div className="space-y-1">
            {categoryKeywords.map((kw: any) => (
              <div key={kw.text} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(kw.text)}
                    onChange={() => onToggle(kw.text)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">{kw.text}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{kw.matchType}</span>
                </div>
                <button
                  onClick={() => onCopy(kw.text)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedItems.has(kw.text) ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {negativeKeywords.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Negative Keywords</h3>
          <div className="space-y-1">
            {negativeKeywords.map((kw: string) => (
              <div key={kw} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-red-600">-{kw}</span>
                <button
                  onClick={() => onCopy(`-${kw}`)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedItems.has(`-${kw}`) ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfluencersList({ influencers, selectedItems, copiedItems, onToggle, onCopy }: any) {
  return (
    <div className="space-y-2">
      {influencers.map((influencer: any) => (
        <div key={influencer.handle} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedItems.has(influencer.handle)}
              onChange={() => onToggle(influencer.handle)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <div className="font-medium text-sm">{influencer.handle}</div>
              {influencer.name && <div className="text-xs text-gray-500">{influencer.name}</div>}
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {influencer.category}
                </span>
                {influencer.followerCount && (
                  <span className="text-xs text-gray-500">
                    {(influencer.followerCount / 1000000).toFixed(1)}M followers
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => onCopy(influencer.handle)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {copiedItems.has(influencer.handle) ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}

function InterestsList({ interests, selectedItems, copiedItems, onToggle, onCopy }: any) {
  return (
    <div className="space-y-2">
      {interests.map((interest: any) => (
        <div key={interest.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedItems.has(interest.id)}
              onChange={() => onToggle(interest.id)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <div className="font-medium text-sm">{interest.name}</div>
              {interest.subcategories && (
                <div className="text-xs text-gray-500 mt-1">
                  {interest.subcategories.join(', ')}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onCopy(interest.name)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {copiedItems.has(interest.name) ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}