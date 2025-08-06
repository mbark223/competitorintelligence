import { Download, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { TargetingResult } from '@/lib/types/targeting'
import Papa from 'papaparse'

interface ExportOptionsProps {
  results: TargetingResult
}

export default function ExportOptions({ results }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false)

  const exportToCSV = () => {
    // Prepare data for CSV export
    const csvData = []
    
    // Add handles
    csvData.push(['Category', 'Type', 'Value', 'Details', 'Additional Info'])
    
    results.handles.forEach(handle => {
      csvData.push(['Handles', handle.category, handle.handle, handle.name, handle.verified ? 'Verified' : ''])
    })
    
    results.hashtags.forEach(hashtag => {
      csvData.push(['Hashtags', hashtag.usage + ' usage', hashtag.tag, hashtag.description || '', ''])
    })
    
    results.personalities.forEach(person => {
      csvData.push(['Personalities', person.influence, person.handle, person.name, person.role])
    })
    
    results.relatedKeywords.forEach(keyword => {
      csvData.push(['Keywords', keyword.matchType + ' match', keyword.term, keyword.category, ''])
    })
    
    results.geographicTargets.forEach(geo => {
      csvData.push(['Geographic', geo.type, geo.location, geo.relevance + ' relevance', ''])
    })
    
    results.mediaHandles.forEach(media => {
      csvData.push(['Media', 'publication', media.handle, media.name, ''])
    })
    
    results.events.forEach(event => {
      csvData.push(['Events', 'event', event.name, event.date || '', event.hashtags.join(', ')])
    })
    
    results.competitors.forEach(competitor => {
      csvData.push(['Competitors', competitor.category, competitor.handle, competitor.name, ''])
    })

    // Convert to CSV
    const csv = Papa.unparse(csvData)
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `twitter-targeting-${results.keyword.toLowerCase().replace(/\s+/g, '-')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async () => {
    const text = formatResultsAsText(results)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatResultsAsText = (data: TargetingResult): string => {
    let text = `Twitter Targeting for: ${data.keyword}\n\n`
    
    text += `OFFICIAL HANDLES (${data.handles.length}):\n`
    data.handles.forEach(h => {
      text += `${h.handle} - ${h.name}${h.verified ? ' ✓' : ''}\n`
    })
    
    text += `\nHASHTAGS (${data.hashtags.length}):\n`
    data.hashtags.forEach(h => {
      text += `${h.tag} (${h.usage} usage)\n`
    })
    
    text += `\nKEY PERSONALITIES (${data.personalities.length}):\n`
    data.personalities.forEach(p => {
      text += `${p.name} - ${p.handle} - ${p.role} (${p.influence})\n`
    })
    
    text += `\nKEYWORDS:\n`
    const keywordsByType = data.relatedKeywords.reduce((acc, k) => {
      if (!acc[k.matchType]) acc[k.matchType] = []
      acc[k.matchType].push(k.term)
      return acc
    }, {} as Record<string, string[]>)
    
    Object.entries(keywordsByType).forEach(([type, keywords]) => {
      text += `${type.toUpperCase()} MATCH: ${keywords.join(', ')}\n`
    })
    
    text += `\nGEOGRAPHIC TARGETS (${data.geographicTargets.length}):\n`
    data.geographicTargets.forEach(g => {
      text += `${g.location} (${g.type})\n`
    })
    
    text += `\nMEDIA HANDLES (${data.mediaHandles.length}):\n`
    data.mediaHandles.forEach(m => {
      text += `${m.handle} - ${m.name}\n`
    })
    
    if (data.events.length > 0) {
      text += `\nEVENTS (${data.events.length}):\n`
      data.events.forEach(e => {
        text += `${e.name}${e.date ? ` - ${e.date}` : ''} - ${e.hashtags.join(', ')}\n`
      })
    }
    
    if (data.competitors.length > 0) {
      text += `\nCOMPETITORS (${data.competitors.length}):\n`
      data.competitors.forEach(c => {
        text += `${c.name} - ${c.handle}\n`
      })
    }
    
    return text
  }

  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={exportToCSV}
        className="flex items-center px-6 py-3 bg-white border border-twitter-extra-light-gray rounded-full hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Export to CSV
      </button>
      <button
        onClick={copyToClipboard}
        className="flex items-center px-6 py-3 bg-white border border-twitter-extra-light-gray rounded-full hover:bg-gray-50 transition-colors"
      >
        {copied ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </>
        )}
      </button>
    </div>
  )
}