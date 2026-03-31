
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/student/dashboard" element={<StudentDashboard/>} />
      <Route path="/student/issues" element={<StudentIssues />} />
      <Route path="/student/submit" element={<SubmitIssue />} />
    </Routes>
  )
}

export default App