import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getIssues } from '../../api/issues'

export default function LecturerResolved() {
  const [issues, setIssues]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIssues()
      .then((res) => {
        const all = res.data.results || res.data
        setIssues(all.filter((i) => i.status === 'resolved'))
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Resolved Issues</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : issues.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-gray-500">No resolved issues yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Department</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Resolved On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.student_name}</td>
                  <td className="px-6 py-4 text-gray-500">{issue.department_details?.name || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(issue.updated_at).toLocaleDateString()}
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