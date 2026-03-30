import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues } from '../../api/issues'
import { useAuth } from '../../context/AuthContext'

// Status badge component
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

export default function StudentDashboard() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIssues()
      .then((res) => setIssues(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Count issues by status
  const total = issues.length
  const pending = issues.filter((i) => i.status === 'pending').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const resolved = issues.filter((i) => i.status === 'resolved').length

  const cards = [
    { label: 'Total Issues', value: total, color: 'bg-blue-500', icon: '📄' },
    { label: 'Pending', value: pending, color: 'bg-yellow-500', icon: '⏳' },
    { label: 'In Progress', value: inProgress, color: 'bg-orange-500', icon: '▶️' },
    { label: 'Resolved', value: resolved, color: 'bg-green-500', icon: '✅' },
  ]

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${card.color} text-white text-xl w-12 h-12 rounded-xl flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : issues.length === 0 ? (
          <p className="text-gray-400 text-sm">No issues submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted on {new Date(issue.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}