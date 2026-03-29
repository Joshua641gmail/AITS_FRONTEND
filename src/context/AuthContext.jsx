import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, logoutUser } from '../api/auth'

// 1. Create the context
const AuthContext = createContext()

// 2. Create the provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // When the app loads, check if a user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (credentials) => {
    const response = await loginUser(credentials)
    const { user, access, refresh } = response.data

    // Save tokens and user to localStorage
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(user))

    setUser(user)
    return user
  }

  // Logout function
  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      await logoutUser({ refresh })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear everything from localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook to use the context easily
export function useAuth() {
  return useContext(AuthContext)
}