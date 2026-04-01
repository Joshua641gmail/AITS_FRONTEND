import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getDepartments, createDepartment } from '../../api/departments'

export default function RegistrarDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [name, setName]               = useState('')
  const [code, setCode]               = useState('')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  useEffect(() => {
    getDepartments()
      .then((res) => setDepartments(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!name || !code) return setError('Name and code are required.')
    setSaving(true)
    setError('')
    try {
      const res = await createDepartment({ name, code })
      setDepartments((prev) => [...prev, res.data])
      setShowModal(false)
      setName('')
      setCode('')
    } catch (err) {
      setError('Failed to create department.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1a2744] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-blue-900 transition"
        >
          + Add Department
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
          <p className="text-4xl mb-3">🏫</p>
          <p className="text-gray-500">No departments yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                  🏫
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{dept.name}</p>
                  <p className="text-xs text-gray-400">Code: {dept.code}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Head of Dept:</span>
                  <span className="font-medium text-gray-700">
                    {dept.head_username || '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Add Department</h2>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. CS"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 bg-[#1a2744] text-white py-2.5 rounded-lg text-sm hover:bg-blue-900 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Create Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}