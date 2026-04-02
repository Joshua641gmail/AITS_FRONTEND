import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues, updateIssueStatus } from '../../api/issues'

function StatusBadge({ status }) {
  const colors = {
    assigned:    'bg-blue-100 text-blue-700',
    in_progress: 'bg-orange-100 text-orange-700',
    resolved:    'bg-green-100 text-green-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default function LecturerAssignments() {
  const [issues, setIssues]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    getIssues()
      .then((res) => setIssues(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true)
    setError('')
    try {
      await updateIssueStatus(selected.id, { status: newStatus })
      setIssues((prev) =>
        prev.map((i) => i.id === selected.id ? { ...i, status: newStatus } : i)
      )
      setSelected(null)
    } catch (err) {
      setError('Failed to update status.')
    } finally {
      setUpdating(false)
    }
  }

  // Only show non-resolved issues in My Assignments
  const activeIssues = issues.filter((i) => i.status !== 'resolved')

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : activeIssues.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">No active assignments.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.student_name}</td>
                  <td className="px-6 py-4"><StatusBadge status={issue.status} /></td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelected(issue); setError('') }}
                      className="bg-[#1a2744] text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-900 transition"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Status Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Update Status</h2>
            <p className="text-sm text-gray-500 mb-2">{selected.title}</p>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-gray-400">Current status:</span>
              <StatusBadge status={selected.status} />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {selected.status === 'assigned' && (
                <button
                  onClick={() => handleUpdateStatus('in_progress')}
                  disabled={updating}
                  className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {updating ? 'Updating...' : '▶️ Mark as In Progress'}
                </button>
              )}
              {selected.status === 'in_progress' && (
                <button
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={updating}
                  className="w-full bg-green-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-600 transition disabled:opacity-50"
                >
                  {updating ? 'Updating...' : '✅ Mark as Resolved'}
                </button>
              )}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-3 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}