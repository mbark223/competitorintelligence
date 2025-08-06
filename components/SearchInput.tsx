import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: (keyword: string) => void
  loading: boolean
}

export default function SearchInput({ value, onChange, onSearch, loading }: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a keyword (e.g., NFL, Gaming, Fashion, Tech...)"
          className="twitter-input pl-12 pr-32 text-lg"
          disabled={loading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-twitter-dark-gray" />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 twitter-button py-2 px-4 text-sm"
        >
          {loading ? 'Generating...' : 'Generate Targeting'}
        </button>
      </div>
      <div className="mt-2 text-sm text-twitter-dark-gray">
        Examples: NFL, Cryptocurrency, Fashion Week, AI Technology, Travel, Food & Dining
      </div>
    </form>
  )
}