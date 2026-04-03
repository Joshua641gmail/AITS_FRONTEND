
/*function App() {
  return (
    <div className="text-blue-600 text-2xl font-bold p-8">
      AITS Frontend is working!
    </div>
  )
}

export default App*/
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import StudentDashboard  from './pages/student/Dashboard'
import StudentIssues from './pages/student/Issues'
import SubmitIssue from './pages/student/SubmitIssue'
import StudentProfile from './pages/student/Profile'
import RegistrarDashboard from './pages/registrar/Dashboard'
import RegistrarIssues from './pages/registrar/Issues'
import RegistrarDepartments from './pages/registrar/Departments'
import RegistrarUsers from './pages/registrar/Users'
import RegistrarAssignments from './pages/registrar/Assignments'
import LecturerDashboard from './pages/lecturer/Dashboard'
import LecturerAssignments from './pages/lecturer/Assignments'
import LecturerResolved from './pages/lecturer/Resolved'
import LecturerProfile from './pages/lecturer/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/student/dashboard" element={<StudentDashboard/>} />
      <Route path="/student/issues" element={<StudentIssues />} />
      <Route path="/student/submit" element={<SubmitIssue />} />
      <Route path="/student/profile" element={<StudentProfile />} />

      {/* Registrar Routes */}
      <Route path="/registrar/dashboard" element={<RegistrarDashboard />} />
      <Route path="/registrar/issues" element={<RegistrarIssues />} />
      <Route path="/registrar/departments" element={<RegistrarDepartments />} />
      <Route path="/registrar/users" element={<RegistrarUsers />} />
      <Route path="/registrar/assignments" element={<RegistrarAssignments />} />

      {/* Lecturer Routes */}
      <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
      <Route path="/lecturer/assignments" element={<LecturerAssignments />} />
      <Route path="/lecturer/resolved" element={<LecturerResolved />} />
      <Route path="/lecturer/profile" element={<LecturerProfile />} />

    </Routes>
  )
}

export default App