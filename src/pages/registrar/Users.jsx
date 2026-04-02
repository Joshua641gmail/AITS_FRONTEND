import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getUsers } from '../../api/users'

export default function RegistrarUsers() {
  const [users, setUsers]   = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const roleColors = {
    student:   'bg-blue-100 text-blue-700',
    registrar: 'bg-purple-100 text-purple-700',
    lecturer:  'bg-green-100 text-green-700',
  }

  const filters = ['all', 'student', 'registrar', 'lecturer']
  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter)

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
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
            {f === 'all' ? 'All' : `${f}s`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">User</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Role</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.username}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.department_info?.name || '—'}
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