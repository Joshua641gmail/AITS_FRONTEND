import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues } from '../../api/issues'

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    assigned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-orange-100 text-orange-700',
    resolved: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default function StudentIssues() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIssues()
      .then((res) => setIssues(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Issues</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : issues.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No issues submitted yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Submit Issue" in the sidebar to get started.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Department</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {issue.department_details?.name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}