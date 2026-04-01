import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues } from '../../api/issues'

function StatusBadge({ status }) {
  const colors = {
    pending:     'bg-yellow-100 text-yellow-700',
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

export default function RegistrarAssignments() {
  const [issues, setIssues]   = useState([])
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIssues()
      .then((res) => setIssues(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filters  = ['all', 'pending', 'assigned', 'in_progress', 'resolved']
  const filtered = filter === 'all' ? issues : issues.filter((i) => i.status === filter)

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignments</h1>

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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">📌</p>
            <p className="text-gray-500">No assignments found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Issue</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Department</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.student_name}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.department_details?.name || '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={issue.status} /></td>
                  <td className="px-6 py-4 text-gray-500">
                    {issue.assignment?.lecturer_name || '—'}
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