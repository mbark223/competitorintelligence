import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Facebook Ad Intelligence Platform
        </h1>
        <p className="text-gray-600">
          Monitor competitor Facebook ads and analyze performance with AI-powered insights
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Ads</div>
          <div className="text-3xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-500 mt-2">Across all brands</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Active Jobs</div>
          <div className="text-3xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-500 mt-2">Currently running</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Analyzed Ads</div>
          <div className="text-3xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-500 mt-2">With AI insights</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/jobs"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 transition-colors"
        >
          <div className="text-lg font-semibold mb-2">View Jobs</div>
          <div className="text-sm opacity-90">Monitor ad fetch jobs and their status</div>
        </Link>

        <Link
          href="/ads"
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 transition-colors"
        >
          <div className="text-lg font-semibold mb-2">Browse Ads</div>
          <div className="text-sm opacity-90">Explore fetched competitor ads</div>
        </Link>

        <Link
          href="/brands"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 transition-colors"
        >
          <div className="text-lg font-semibold mb-2">Manage Brands</div>
          <div className="text-sm opacity-90">Add or edit competitor brands</div>
        </Link>

        <div className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-6 transition-colors cursor-pointer">
          <div className="text-lg font-semibold mb-2">API Webhooks</div>
          <div className="text-sm opacity-90">Trigger workflows via API</div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Set up Airtable API Key</h3>
            <p className="text-gray-600 text-sm mb-2">
              Update <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> with your Airtable API key:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              AIRTABLE_API_KEY=YOUR_KEY_HERE
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Trigger Ad Fetch via Webhook</h3>
            <p className="text-gray-600 text-sm mb-2">
              Send a POST request to trigger ad fetching:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST http://localhost:3000/api/webhooks/ad-fetch-jobs \\
  -H "Content-Type: application/json" \\
  -d '{"recordId": "recXXXXXXXXXXXXXX"}'`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Analyze Ads with AI</h3>
            <p className="text-gray-600 text-sm mb-2">
              Trigger video analysis with Gemini AI:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST http://localhost:3000/api/webhooks/ad-analysis \\
  -H "Content-Type: application/json" \\
  -d '{"limit": 10}'`}
            </pre>
          </div>
        </div>
      </div>

      {/* Webhook Status */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Webhook Endpoints</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Ad Fetch Jobs</div>
              <div className="text-sm text-gray-600">POST /api/webhooks/ad-fetch-jobs</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Ad Analysis</div>
              <div className="text-sm text-gray-600">POST /api/webhooks/ad-analysis</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
          </div>
        </div>
      </div>
    </main>
  )
}