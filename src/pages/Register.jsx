import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { getDepartments } from '../api/departments'

export default function Register() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  })
  const [departments, setDepartments] = useState([])
  const [loadingDepts, setLoadingDepts] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    setLoadingDepts(true)
    getDepartments()
      .then((res) => setDepartments(res.data.results || res.data))
      .catch((err) => console.error('Failed to load departments:', err))
      .finally(() => setLoadingDepts(false))
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const roleBannerColors = {
    student: 'bg-blue-50 text-blue-800 border-blue-200',
    lecturer: 'bg-green-50 text-green-800 border-green-200',
    registrar: 'bg-orange-50 text-orange-800 border-orange-200',
  }

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role })
  }

  const handleContinue = () => {
    if (!formData.role) {
      setError('Please select a role to continue.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (!formData.department && formData.role === 'lecturer') {
      setError('Please select your department.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }
      // Only attach department for lecturers
      if (formData.department && formData.role === 'lecturer') {
        payload.department = parseInt(formData.department)
      }

      await registerUser(payload)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRoleLabel = (role) => {
    if (role === 'student') return 'Student'
    if (role === 'lecturer') return 'Lecturer'
    if (role === 'registrar') return 'Academic Registrar'
    return ''
  }

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: Branding & Step Indicators */}
      <div className="hidden lg:flex w-[45%] bg-[#0f172a] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">AITS</h1>
              <p className="text-xs text-gray-400">Academic Issue Tracking System</p>
            </div>
          </div>
          
          <div className="mt-24">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Join the academic <br />
              <span className="text-blue-400">issue tracking platform.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Create your account and get access to your personalized issue management tools.
            </p>
          </div>
        </div>

        <div className="z-10 space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Registration Steps</p>
          <div className={`flex items-center gap-3 ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > 1 ? 'bg-green-500' : step === 1 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`text-sm font-medium ${step === 1 ? 'text-white' : 'text-gray-400'}`}>Personal Information</span>
          </div>
          <div className={`flex items-center gap-3 ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-blue-600' : 'bg-gray-700'}`}>2</div>
            <span className={`text-sm font-medium ${step === 2 ? 'text-white' : 'text-gray-400'}`}>Account Credentials</span>
          </div>
        </div>

        <div className="z-10 text-sm text-gray-500">© 2026 AITS Portal. All rights reserved.</div>
      </div>

      {/* RIGHT SIDE: Form Area */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-lg">
          
          {/* Header - Only shows in Step 2 to match reference image exactly */}
          {step === 2 && (
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Set credentials</h2>
              <p className="text-gray-500 mt-2 font-medium">Step 2 of 2 — Username & password</p>
            </div>
          )}

          {/* Progress Bar */}
          {step === 1 && (
            <div className="w-full h-2 bg-gray-100 rounded-full mb-8 flex overflow-hidden gap-1">
              <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
              <div className="h-full flex-1 bg-gray-100 rounded-full"></div>
            </div>
          )}
          
          {/* Full Progress Bar in Step 2 */}
          {step === 2 && (
            <div className="w-full h-2 bg-gray-100 rounded-full mb-8 flex overflow-hidden gap-1">
              <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
              <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-sm font-semibold text-gray-800">I am a...</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: 'student', title: 'Student', desc: 'Submit academic logs and track your issues', color: 'blue' },
                  { value: 'lecturer', title: 'Lecturer', desc: 'Review and approve student academic logs', color: 'green' },
                  { value: 'registrar', title: 'Academic Staff', desc: 'System-wide oversight and management', color: 'orange' },
                ].map((role) => {
                  const isActive = formData.role === role.value
                  const borderColor = role.color === 'blue' ? 'border-blue-500 bg-blue-50' : 
                                      role.color === 'green' ? 'border-green-500 bg-green-50' : 
                                      'border-orange-500 bg-orange-50'
                  const textColor = role.color === 'blue' ? 'text-blue-800' : 
                                    role.color === 'green' ? 'text-green-800' : 
                                    'text-orange-800'
                  const descColor = role.color === 'blue' ? 'text-blue-600' : 
                                    role.color === 'green' ? 'text-green-600' : 
                                    'text-orange-600'

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleSelect(role.value)}
                      className={`text-left p-5 rounded-xl border-2 transition-all relative ${isActive ? `${borderColor} shadow-sm` : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <h3 className={`font-bold text-base ${isActive ? textColor : 'text-gray-800'}`}>{role.title}</h3>
                      <p className={`text-sm mt-1 ${isActive ? descColor : 'text-gray-500'}`}>{role.desc}</p>
                    </button>
                  )
                })}
              </div>

              <button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-200 mt-6 text-lg shadow-md shadow-blue-600/20">
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Account Details */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Back Arrow & Title (Matches Reference Image) */}
              <div className="flex items-center gap-4 mb-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1 text-sm font-medium"
                >
                  ← Back
                </button>
              </div>

              {/* Selected Role Banner */}
              {formData.role && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium ${roleBannerColors[formData.role] || 'bg-gray-50 text-gray-800'}`}>
                  <span>✓</span>
                  <span>Registering as: {getRoleLabel(formData.role)}</span>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              {/* Department (Hidden for Registrar/Student) */}
              {formData.role === 'lecturer' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🏫</span>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                      required
                      disabled={loadingDepts}
                    >
                      <option value="">{loadingDepts ? 'Loading departments...' : 'Select your department'}</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Lecturers are assigned to specific departments to receive relevant issues.
                  </p>
                </div>
              )}

              {/* ✅ ADDED PASSWORD FIELD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Min. 6 characters"
                    required
                    minLength="6"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Re-enter your password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <span>👤</span>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}