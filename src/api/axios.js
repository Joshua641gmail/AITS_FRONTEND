import axios from 'axios'

// This is the base URL of your Django API
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// This runs before every request
// It automatically attaches the JWT token to every request header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API