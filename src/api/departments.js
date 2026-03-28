import API from './axios'

// Get all departments
export const getDepartments = () => API.get('/departments/')

// Create a department (registrar only)
export const createDepartment = (data) => API.post('/departments/', data)
