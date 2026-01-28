export default function BrandsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Management</h1>
        <p className="text-gray-600">Manage competitor brands to monitor</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">🏢 Brand Management Coming Soon</h2>
        <p className="text-purple-800 mb-4">
          The brand management interface is under development. For now:
        </p>
        <ul className="list-disc list-inside space-y-2 text-purple-800">
          <li>Add/edit brands directly in your Airtable "Brands" table</li>
          <li>Include brand name and Facebook Ad Library page URL</li>
          <li>Link brands to ad fetch jobs for automated monitoring</li>
        </ul>
      </div>

      {/* Setup Guide */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Add Brands</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 1: Find Facebook Page</h3>
            <p className="text-gray-600 text-sm mb-3">
              Locate your competitor's Facebook page. The URL should look like:
            </p>
            <code className="block bg-gray-100 p-3 rounded text-sm text-gray-900">
              https://www.facebook.com/YourCompetitor
            </code>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 2: Get Ad Library URL</h3>
            <p className="text-gray-600 text-sm mb-3">
              Go to Facebook Ad Library and search for the brand. Copy the "See all ads" URL:
            </p>
            <code className="block bg-gray-100 p-3 rounded text-sm text-gray-900 break-all">
              https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=BrandName&search_type=keyword_unordered&media_type=all
            </code>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 3: Add to Airtable</h3>
            <p className="text-gray-600 text-sm mb-3">
              In your Airtable "Brands" table, create a new record with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
              <li><strong>brand_name:</strong> Competitor name (e.g., "FanDuel Casino")</li>
              <li><strong>facebook_page_url:</strong> The Ad Library URL from Step 2</li>
              <li><strong>created_at:</strong> Today's date</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Monitored Brands Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Brands</h2>
        <p className="text-gray-600 mb-4">
          View your monitored brands in the Airtable "Brands" table. Each brand can be:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Linked to Jobs</div>
            <p className="text-xs text-gray-600">
              Create ad fetch jobs for specific brands to automate monitoring
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Tracked Over Time</div>
            <p className="text-xs text-gray-600">
              Historical ad data helps identify trends and strategy changes
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Analyzed with AI</div>
            <p className="text-xs text-gray-600">
              Video ads automatically analyzed for insights and competitive intelligence
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
