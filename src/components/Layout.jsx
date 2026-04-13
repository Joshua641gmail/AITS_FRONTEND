import { useState } from 'react'
import Sidebar from './Sidebar'
import HelpMenu from './HelpMenu'

export default function Layout({ children }) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 min-h-screen bg-gray-100 p-8 relative">
        
        {/* Floating Help Trigger Button (Icon + Label) */}
        <button
          onClick={() => setShowHelp(true)}
          className="fixed top-6 right-8 bg-[#1a2744] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg shadow-lg transition z-40 flex items-center gap-2 text-sm font-medium"
          title="Help & Quick Guide"
        >
          <span>📘</span>
          <span>Help & Guide</span>
        </button>

        {/* Help Menu Modal */}
        <HelpMenu isOpen={showHelp} onClose={() => setShowHelp(false)} />
        
        {children}
      </div>
    </div>
  )
}