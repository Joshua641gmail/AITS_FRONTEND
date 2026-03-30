import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar — fixed on the left */}
      <Sidebar />

      {/* Main content — pushed right to avoid sidebar */}
      <div className="ml-60 flex-1 min-h-screen bg-gray-100 p-8">
        {children}
      </div>
    </div>
  )
}