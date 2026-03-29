
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App