import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues } from '../../api/issues'

export default function LecturerDashboard() {
  const [issues, setIssues]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIssues()
      .then((res) => setIssues(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const assigned   = issues.filter((i) => i.status === 'assigned').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const resolved   = issues.filter((i) => i.status === 'resolved').length

  const cards = [
    { label: 'Assigned to Me', value: assigned,   color: 'bg-blue-500',   icon: '📋' },
    { label: 'In Progress',    value: inProgress,  color: 'bg-orange-500', icon: '▶️' },
    { label: 'Resolved',       value: resolved,    color: 'bg-green-500',  icon: '✅' },
  ]

  // Issues that need action (assigned but not yet in progress)
  const actionRequired = issues.filter((i) => i.status === 'assigned')

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${card.color} text-white text-xl w-12 h-12 rounded-xl flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Required */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Action Required</h2>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : actionRequired.length === 0 ? (
          <p className="text-gray-400 text-sm">
            You have no new assignments requiring action.
          </p>
        ) : (
          <div className="space-y-3">
            {actionRequired.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {issue.student_name} · {issue.department_details?.name || '—'}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Assigned
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}