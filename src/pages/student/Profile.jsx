import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getMe } from '../../api/users'

export default function StudentProfile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getMe()
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white rounded-xl shadow-sm max-w-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-[#1a2744]" />

        {/* Avatar and Name */}
        <div className="px-8 pb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl -mt-10 border-4 border-white shadow">
            👤
          </div>

          <div className="mt-3 flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {profile?.username}
            </h2>
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full capitalize">
              {profile?.role}
            </span>
          </div>

          {/* Details */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-xl">
              <span className="text-xl">✉️</span>
              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="text-sm font-medium text-gray-800">
                  {profile?.email || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-xl">
              <span className="text-xl">🏫</span>
              <div>
                <p className="text-xs text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-800">
                  {profile?.department_info?.name || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-xl">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-xs text-gray-400">Account Status</p>
                <p className="text-sm font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
