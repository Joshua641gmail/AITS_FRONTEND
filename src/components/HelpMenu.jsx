import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function HelpMenu({ isOpen, onClose }) {
  const { user } = useAuth()
  const [selectedTopic, setSelectedTopic] = useState(null)
  
  if (!isOpen) return null

  const role = user?.role || 'student'

  // Simple, easy-to-understand help topics for each role
  const roleTopics = {
    student: [
      { 
        id: 'submit-log',
        icon: '📝', 
        title: 'How to Submit an Academic Log',
        steps: [
          'Click "Submit Issue" in the menu on the left',
          'Type a short title for your problem (example: "Missing Grade for Math Class")',
          'Choose your department from the list',
          'Write details about your problem in the big text box',
          'Click the blue "Submit Issue" button',
          'You will see a green success message',
          'Your issue now appears in "My Issues" with "Pending" status'
        ],
        tips: '💡 Tip: Only submit one issue per problem. Don\'t submit the same issue twice.'
      },
      { 
        id: 'view-logs',
        icon: '👁️', 
        title: 'How to View Your Submitted Logs',
        steps: [
          'Click "My Issues" in the menu on the left',
          'You will see a table with all your submitted issues',
          'Each row shows: the title, department, status color, and date',
          'The status colors mean: Yellow = Waiting, Blue = Assigned, Orange = Being Worked On, Green = Done'
        ],
        tips: '💡 Tip: You can only see your own issues, not other students\' issues.'
      },
      { 
        id: 'check-status',
        icon: '📊', 
        title: 'How to Check Status and Grades',
        steps: [
          'Your main Dashboard shows 4 colored boxes',
          'Total Issues = how many you have submitted',
          'Pending = waiting for the registrar to assign',
          'In Progress = a lecturer is working on it',
          'Resolved = your issue is finished',
          'When status shows "Resolved", click on that issue in "My Issues" to see the lecturer\'s notes and your grade'
        ],
        tips: '💡 Tip: Check your Dashboard often to see if your issue status has changed.'
      },
      { 
        id: 'edit-delete',
        icon: '✏️', 
        title: 'How to Edit or Delete a Log',
        steps: [
          'Go to "My Issues"',
          'Find the issue you want to change',
          'You can ONLY edit or delete if the status is "Pending" (yellow)',
          'If the status has changed to anything else, you cannot edit it',
          'If you made a mistake after it was assigned, email the registrar to fix it'
        ],
        tips: '⚠️ Warning: Once someone starts working on your issue, you cannot change it yourself.'
      },
      { 
        id: 'contact-lecturer',
        icon: '💬', 
        title: 'How to Contact a Lecturer',
        steps: [
          'When you submit an issue, you can add notes in the description',
          'Once your issue is assigned, you will see the lecturer\'s name in "My Issues"',
          'For questions, use your university email to contact them directly',
          'All updates about your issue will appear in the system automatically'
        ],
        tips: '💡 Tip: Be polite and include your issue title when emailing lecturers.'
      }
    ],
    registrar: [
      { 
        id: 'manage-students',
        icon: '👥', 
        title: 'How to Manage Student Records',
        steps: [
          'Click "Users" in the menu on the left',
          'You will see tabs: All, Students, Registrars, Lecturers',
          'Click a tab to see only that type of user',
          'Each row shows: username, email, role badge, and department',
          'To add new users, use the Admin panel (not this system)'
        ],
        tips: '💡 Tip: Use the search box to quickly find a specific person.'
      },
      { 
        id: 'oversee-evaluations',
        icon: '🔍', 
        title: 'How to Oversee Log Evaluations',
        steps: [
          'Click "All Issues" in the menu',
          'Use the tabs at the top to filter: All, Pending, Assigned, In Progress, Resolved',
          'Each issue shows: title, student name, department, and status',
          'Your Dashboard shows how many issues are at each stage',
          'Watch for issues stuck in "Pending" - these need your action'
        ],
        tips: '💡 Tip: The Dashboard gives you a quick overview of what needs attention.'
      },
      { 
        id: 'generate-reports',
        icon: '📈', 
        title: 'How to Generate Reports',
        steps: [
          'Your Dashboard shows: Total Issues, Unassigned, Assigned, Resolved, Total Users, Departments',
          'These numbers update automatically',
          'To save a report: Press Ctrl+P (or Cmd+P on Mac) to print as PDF',
          'The "System Overview" section shows the 5 most recent issues',
          'For detailed data, use the Admin panel to export to Excel'
        ],
        tips: '💡 Tip: Take screenshots of your Dashboard for monthly reports.'
      },
      { 
        id: 'approve-reject',
        icon: '✅', 
        title: 'How to Approve or Reject Logs',
        steps: [
          'Go to "All Issues"',
          'Click the "Pending" tab to see issues waiting for you',
          'Click the blue "Assign" button next to an issue',
          'A window pops up showing the issue title',
          'Choose a lecturer from the dropdown (only lecturers from the right department will show)',
          'Add notes for the lecturer if needed (optional)',
          'Click "Confirm Assign"',
          'The issue status changes to "Assigned" automatically',
          'To reject an issue, you must use the Admin panel'
        ],
        tips: '💡 Tip: The system won\'t let you assign to the wrong department - it\'s automatic!'
      },
      { 
        id: 'assign-students',
        icon: '🎓', 
        title: 'How to Assign Students to Lecturers',
        steps: [
          'This happens automatically when you assign an issue',
          'Go to "All Issues" and find a Pending issue',
          'Click "Assign"',
          'The dropdown only shows lecturers from the same department as the issue',
          'If the dropdown is empty, there are no lecturers in that department yet',
          'Add lecturers through the Users section or Admin panel first',
          'After choosing a lecturer, click "Confirm Assign"',
          'The lecturer gets notified automatically'
        ],
        tips: '💡 Tip: Always check that the department matches before assigning.'
      }
    ],
    lecturer: [
      { 
        id: 'view-submissions',
        icon: '📥', 
        title: 'How to View Student Submissions',
        steps: [
          'Click "My Assignments" in the menu on the left',
          'You will see only issues assigned to YOU',
          'The table shows: issue title, student name, current status',
          'Only active issues appear here (not resolved ones)',
          'Your Dashboard shows how many issues are assigned to you',
          'To see completed work, click "Resolved Issues" in the menu'
        ],
        tips: '💡 Tip: The "Action Required" section on your Dashboard highlights new assignments.'
      },
      { 
        id: 'evaluate-grade',
        icon: '📝', 
        title: 'How to Evaluate and Grade Logs',
        steps: [
          'Go to "My Assignments"',
          'Find the issue you want to work on',
          'Click the blue "Update Status" button',
          'A window shows the current status',
          'If status is "Assigned": Click "Mark as In Progress"',
          'If status is "In Progress": Click "Mark as Resolved"',
          'Add your feedback and grade in the remarks before marking as Resolved',
          'The status updates immediately'
        ],
        tips: '⚠️ Warning: You must go in order. You cannot skip from "Assigned" directly to "Resolved".'
      },
      { 
        id: 'provide-feedback',
        icon: '💬', 
        title: 'How to Provide Feedback to Students',
        steps: [
          'When you update the status, you can add notes',
          'Add detailed feedback when marking as "In Progress" or "Resolved"',
          'Students see your feedback right away on their Dashboard',
          'Your feedback appears in their "My Issues" table',
          'All your notes are saved permanently in the system'
        ],
        tips: '💡 Tip: Be clear and specific. Tell students what you did to fix their issue.'
      },
      { 
        id: 'manage-rosters',
        icon: '📚', 
        title: 'How to Manage Class Rosters',
        steps: [
          'Click "Profile" to see your department',
          'You can view all students in your department using the "Users" page (if available)',
          'Filter by your department to see your students',
          'To add or remove students from your department, contact the registrar',
          'You cannot change department assignments yourself'
        ],
        tips: '💡 Tip: You can only see users in your own department for privacy.'
      },
      { 
        id: 'track-deadlines',
        icon: '⏰', 
        title: 'How to Track Submission Deadlines',
        steps: [
          'Your Dashboard shows "Action Required" section',
          'This shows newly assigned issues that need your attention',
          '"My Assignments" shows all your active issues',
          'Sort by date to see older issues first',
          'Try to acknowledge new assignments within 2 days',
          '"Resolved Issues" page shows when you completed each issue'
        ],
        tips: '💡 Tip: Check your Dashboard every day for new assignments.'
      }
    ]
  }

  const currentTopics = roleTopics[role] || roleTopics.student

  // Detailed topic view
  if (selectedTopic) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-[#1a2744] text-white">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedTopic(null)}
                className="text-white/80 hover:text-white text-xl mr-2"
              >
                ← Back
              </button>
              <span className="text-2xl">{selectedTopic.icon}</span>
              <h2 className="text-lg font-bold">{selectedTopic.title}</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none p-1 rounded hover:bg-white/10 transition">&times;</button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* Step-by-Step Instructions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span> Step-by-Step Instructions
              </h3>
              <div className="space-y-3">
                {selectedTopic.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1a2744] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">💡 Helpful Tips</h3>
              <p className="text-sm text-gray-700">{selectedTopic.tips}</p>
            </div>

            {/* Related Topics */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {currentTopics
                  .filter(t => t.id !== selectedTopic.id)
                  .slice(0, 3)
                  .map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className="text-sm text-[#1a2744] hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition"
                    >
                      {topic.icon} {topic.title}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
            <button 
              onClick={() => setSelectedTopic(null)}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium px-4 py-2"
            >
              ← View All Topics
            </button>
            <button 
              onClick={onClose}
              className="bg-[#1a2744] text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition text-sm font-medium"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main topic list view
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between bg-[#1a2744] text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📘</span>
            <div>
              <h2 className="text-xl font-bold">Main Help Topics</h2>
              <p className="text-xs text-white/70 capitalize">
                {role === 'student' ? 'Student Guide' : role === 'registrar' ? 'Registrar Guide' : 'Lecturer Guide'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none p-1 rounded hover:bg-white/10 transition">&times;</button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Quick Tour Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>🚀</span> Quick System Tour
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🧭', label: 'Menu', desc: 'Use the left sidebar to go to different pages' },
                { icon: '🏠', label: 'Dashboard', desc: 'Your home page showing important numbers' },
                { icon: '🏷️', label: 'Status Colors', desc: 'Yellow = Waiting, Blue = Assigned, Orange = Working, Green = Done' },
                { icon: '⚡', label: 'Buttons', desc: 'Click blue buttons to take action on issues' }
              ].map((item, i) => (
                <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{item.label}</h4>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Clickable Topic Links */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📖</span> Select a Topic to Learn More
            </h3>
            <div className="space-y-2">
              {currentTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition text-left group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 flex items-center justify-center text-2xl shadow-sm">
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 group-hover:text-[#1a2744] transition">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-gray-500">Click to see step-by-step guide →</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-[#1a2744] transition text-xl">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full bg-[#1a2744] text-white py-2.5 rounded-lg hover:bg-blue-900 transition text-sm font-medium"
          >
            Close Help Menu
          </button>
        </div>
      </div>
    </div>
  )
}