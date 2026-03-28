import API from './axios'

// Get all users (registrar only)
export const getUsers = () => API.get('/users/')

// Get own profile
export const getMe = () => API.get('/users/me/')

// Get all lecturers (for assignment dropdown)
export const getLecturers = (departmentId) => 
  API.get(`/users/lecturers/${departmentId ? `?department=${departmentId}` : ''}`)