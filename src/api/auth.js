import API from './axios'

// Register a new user
export const registerUser = (data) => API.post('/auth/register/', data)

// Login
export const loginUser = (data) => API.post('/auth/login/', data)

// Logout
export const logoutUser = (data) => API.post('/auth/logout/', data)