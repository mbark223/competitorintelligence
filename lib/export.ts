import { Keyword, Influencer, InterestCategory } from '@/types/targeting'

export function exportToCSV(data: {
  keywords?: Keyword[]
  influencers?: Influencer[]
  interests?: InterestCategory[]
}, filename: string) {
  let csvContent = ''
  
  if (data.keywords && data.keywords.length > 0) {
    csvContent = 'Keyword,Match Type,Category\n'
    data.keywords.forEach(kw => {
      csvContent += `"${kw.text}","${kw.matchType}","${kw.category || ''}"\n`
    })
  }
  
  if (data.influencers && data.influencers.length > 0) {
    csvContent = 'Handle,Name,Followers,Category\n'
    data.influencers.forEach(inf => {
      csvContent += `"${inf.handle}","${inf.name || ''}","${inf.followerCount || ''}","${inf.category}"\n`
    })
  }
  
  if (data.interests && data.interests.length > 0) {
    csvContent = 'Interest Category,Subcategories\n'
    data.interests.forEach(int => {
      csvContent += `"${int.name}","${int.subcategories?.join(', ') || ''}"\n`
    })
  }
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}