import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues, assignIssue } from '../../api/issues'
import { getLecturers } from '../../api/users'

function StatusBadge({ status }) {
  const colors = {
    pending:     'bg-yellow-100 text-yellow-700',
    assigned:    'bg-blue-100 text-blue-700',
    in_progress: 'bg-orange-100 text-orange-700',
    resolved:    'bg-green-100 text-green-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default function RegistrarIssues() {
  const [issues, setIssues]       = useState([])
  const [filter, setFilter]       = useState('all')
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)   // issue being assigned
  const [lecturers, setLecturers] = useState([])
  const [lecturerId, setLecturerId] = useState('')
  const [remarks, setRemarks]     = useState('')
  const [assigning, setAssigning] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    getIssues()
      .then((res) => setIssues(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const openAssignModal = (issue) => {
    setSelected(issue)
    setLecturerId('')
    setRemarks('')
    setError('')
    getLecturers(issue.department)
      .then((res) => setLecturers(res.data.results || res.data))
      .catch((err) => console.error(err))
  }

  const handleAssign = async () => {
    if (!lecturerId) return setError('Please select a lecturer.')
    setAssigning(true)
    try {
      await assignIssue(selected.id, { lecturer: lecturerId, remarks })
      // Update the issue status locally
      setIssues((prev) =>
        prev.map((i) => i.id === selected.id ? { ...i, status: 'assigned' } : i)
      )
      setSelected(null)
    } catch (err) {
      setError('Failed to assign. Check department match.')
    } finally {
      setAssigning(false)
    }
  }

  const filters = ['all', 'pending', 'assigned', 'in_progress', 'resolved']
  const filtered = filter === 'all' ? issues : issues.filter((i) => i.status === filter)

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Issues</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
              filter === f
                ? 'bg-[#1a2744] text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">No issues found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Department</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.student_name}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.department_details?.name || '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={issue.status} /></td>
                  <td className="px-6 py-4">
                    {issue.status === 'pending' ? (
                      <button
                        onClick={() => openAssignModal(issue)}
                        className="bg-[#1a2744] text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-900 transition"
                      >
                        Assign
                      </button>
                    ) : (
                      <button
                        onClick={() => openAssignModal(issue)}
                        className="border text-gray-600 text-xs px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                      >
                        Reassign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Assign Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Assign Issue</h2>
            <p className="text-sm text-gray-500 mb-5">{selected.title}</p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Lecturer
                </label>
                <select
                  value={lecturerId}
                  onChange={(e) => setLecturerId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a lecturer</option>
                  {lecturers.map((l) => (
                    <option key={l.id} value={l.id}>{l.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks (optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Add any notes for the lecturer..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="flex-1 bg-[#1a2744] text-white py-2.5 rounded-lg text-sm hover:bg-blue-900 transition disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : 'Confirm Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}