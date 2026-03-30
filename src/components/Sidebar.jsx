import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navigation items for each role
const studentLinks = [
  { label: 'Dashboard', path: '/student/dashboard', icon: '📊' },
  { label: 'My Issues', path: '/student/issues', icon: '📋' },
  { label: 'Submit Issue', path: '/student/submit', icon: '➕' },
  { label: 'Profile', path: '/student/profile', icon: '👤' },
]

const registrarLinks = [
  { label: 'Dashboard', path: '/registrar/dashboard', icon: '📊' },
  { label: 'All Issues', path: '/registrar/issues', icon: '📋' },
  { label: 'Departments', path: '/registrar/departments', icon: '🏫' },
  { label: 'Users', path: '/registrar/users', icon: '👥' },
  { label: 'Assignments', path: '/registrar/assignments', icon: '📌' },
]

const lecturerLinks = [
  { label: 'Dashboard', path: '/lecturer/dashboard', icon: '📊' },
  { label: 'My Assignments', path: '/lecturer/assignments', icon: '📋' },
  { label: 'Resolved Issues', path: '/lecturer/resolved', icon: '✅' },
  { label: 'Profile', path: '/lecturer/profile', icon: '👤' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Pick the right links based on role
  const links =
    user?.role === 'student' ? studentLinks :
    user?.role === 'registrar' ? registrarLinks :
    lecturerLinks

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="h-screen w-60 bg-[#1a2744] text-white flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-blue-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="font-bold text-lg">AITS Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-green-500 text-white'
                  : 'text-gray-300 hover:bg-blue-800'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info and Logout */}
      <div className="px-4 py-4 border-t border-blue-800">
        <div className="mb-3">
          <p className="font-semibold text-sm">{user?.username}</p>
          <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

    </div>
  )
}