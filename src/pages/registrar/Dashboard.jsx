import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues } from '../../api/issues'
import { getUsers } from '../../api/users'
import { getDepartments } from '../../api/departments'

export default function RegistrarDashboard() {
  const [issues, setIssues] = useState([])
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getIssues(), getUsers(), getDepartments()])
      .then(([issuesRes, usersRes, deptsRes]) => {
        setIssues(issuesRes.data.results || issuesRes.data)
        setUsers(usersRes.data.results || usersRes.data)
        setDepartments(deptsRes.data.results || deptsRes.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const total      = issues.length
  const unassigned = issues.filter((i) => i.status === 'pending').length
  const assigned   = issues.filter((i) => i.status === 'assigned').length
  const resolved   = issues.filter((i) => i.status === 'resolved').length

  const cards = [
    { label: 'Total Issues',   value: total,           color: 'bg-blue-500',   icon: '📄' },
    { label: 'Unassigned',     value: unassigned,      color: 'bg-yellow-500', icon: '⏳' },
    { label: 'Assigned',       value: assigned,        color: 'bg-orange-500', icon: '▶️' },
    { label: 'Resolved',       value: resolved,        color: 'bg-green-500',  icon: '✅' },
    { label: 'Total Users',    value: users.length,    color: 'bg-purple-500', icon: '👥' },
    { label: 'Departments',    value: departments.length, color: 'bg-indigo-500', icon: '🏫' },
  ]

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

      {/* System Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          System Overview
        </h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : issues.length === 0 ? (
          <p className="text-gray-400 text-sm">No issues in the system yet.</p>
        ) : (
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {issue.student_name} · {issue.department_details?.name || '—'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  issue.status === 'pending'     ? 'bg-yellow-100 text-yellow-700' :
                  issue.status === 'assigned'    ? 'bg-blue-100 text-blue-700' :
                  issue.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}