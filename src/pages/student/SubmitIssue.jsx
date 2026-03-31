import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { createIssue } from '../../api/issues'
import { getDepartments } from '../../api/departments'

export default function SubmitIssue() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('')
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Load departments for the dropdown
  useEffect(() => {
    getDepartments()
      .then((res) => setDepartments(res.data.results || res.data))
      .catch((err) => console.error(err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createIssue({ title, description, department })
      setSuccess(true)
      setTimeout(() => navigate('/student/issues'), 1500)
    } catch (err) {
      setError('Failed to submit issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit New Issue</h1>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
        <p className="text-gray-500 text-sm mb-6">
          Provide details about the academic issue you are facing.
        </p>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
            ✅ Issue submitted successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Missing Grade for Calculus II"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe your issue in detail..."
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/student/issues')}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}