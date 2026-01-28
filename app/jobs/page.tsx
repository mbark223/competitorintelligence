export default function JobsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ad Fetch Jobs</h1>
        <p className="text-gray-600">Monitor and manage ad scraping jobs</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">📊 Jobs Dashboard Coming Soon</h2>
        <p className="text-blue-800 mb-4">
          The jobs management UI is under development. In the meantime, you can:
        </p>
        <ul className="list-disc list-inside space-y-2 text-blue-800">
          <li>View jobs directly in your Airtable base</li>
          <li>Trigger jobs via webhook API endpoints</li>
          <li>Monitor job status and logs in Airtable</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trigger New Job</h2>
        <p className="text-gray-600 mb-4">
          Use the webhook endpoint to trigger a new ad fetch job. You'll need a job record ID from Airtable.
        </p>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Webhook Endpoint:</div>
          <code className="text-sm text-gray-900">POST /api/webhooks/ad-fetch-jobs</code>
          <div className="text-sm font-medium text-gray-700 mt-4 mb-2">Example Payload:</div>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "recordId": "recXXXXXXXXXXXXXX"
}`}
          </pre>
        </div>
      </div>

      {/* Status Guide */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Status Guide</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="inline-block w-24 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">Pending</span>
            <p className="ml-4 text-gray-600 text-sm">Job created but not yet started</p>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-24 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">Running</span>
            <p className="ml-4 text-gray-600 text-sm">Job is currently fetching ads from Facebook</p>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-24 px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">Completed</span>
            <p className="ml-4 text-gray-600 text-sm">Job finished successfully, ads stored in Airtable</p>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-24 px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">Failed</span>
            <p className="ml-4 text-gray-600 text-sm">Job encountered an error, check error_message field</p>
          </div>
        </div>
      </div>
    </main>
  )
}
