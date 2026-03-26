import API from './axios'

// Get all issues (scoped by role automatically by backend)
export const getIssues = () => API.get('/issues/')

// Get a single issue
export const getIssue = (id) => API.get(`/issues/${id}/`)

// Submit a new issue (student)
export const createIssue = (data) => API.post('/issues/', data)

// Update an issue
export const updateIssue = (id, data) => API.patch(`/issues/${id}/`, data)

// Assign issue to lecturer (registrar)
export const assignIssue = (id, data) => API.post(`/issues/${id}/assign/`, data)

// Update issue status (lecturer)
export const updateIssueStatus = (id, data) => API.patch(`/issues/${id}/update_status/`, data)