export default function AdsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ads Library</h1>
        <p className="text-gray-600">Browse and analyze fetched competitor ads</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-green-900 mb-2">📚 Ads Library Coming Soon</h2>
        <p className="text-green-800 mb-4">
          The ads browsing interface is under development. Currently you can:
        </p>
        <ul className="list-disc list-inside space-y-2 text-green-800">
          <li>View all fetched ads in your Airtable "Ads (Ad Intelligence)" table</li>
          <li>See ad creative, copy, and performance metrics</li>
          <li>Filter and sort ads by brand, date, and format</li>
        </ul>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">🔍 Advanced Filters</h3>
          <p className="text-gray-600 text-sm mb-4">Filter ads by:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            <li>Brand / Competitor</li>
            <li>Date Range</li>
            <li>Platform (Facebook, Instagram)</li>
            <li>Format (Video, Image, Carousel)</li>
            <li>Status (Active, Inactive)</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">🤖 AI Analysis</h3>
          <p className="text-gray-600 text-sm mb-4">View Gemini AI insights:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            <li>Key themes and messaging</li>
            <li>Sentiment analysis</li>
            <li>Call-to-action effectiveness</li>
            <li>Target audience identification</li>
            <li>Competitive positioning</li>
          </ul>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analyze Ads Now</h2>
        <p className="text-gray-600 mb-4">
          Trigger AI analysis for video ads using the analysis webhook:
        </p>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Webhook Endpoint:</div>
          <code className="text-sm text-gray-900">POST /api/webhooks/ad-analysis</code>
          <div className="text-sm font-medium text-gray-700 mt-4 mb-2">Example Payload:</div>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "limit": 10,
  "startDate": "2026-01-20"
}`}
          </pre>
          <p className="text-xs text-gray-600 mt-3">
            This will analyze up to 10 unanalyzed video ads created after the specified date.
          </p>
        </div>
      </div>
    </main>
  )
}
