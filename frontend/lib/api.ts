import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Auth API
export const authAPI = {
  login: (data: { username: string; password: string }) => api.post("/api/auth/login", data),
  register: (data: { name: string; username: string; password: string }) => api.post("/api/auth/register", data),
}

// User API
export const userAPI = {
  getUser: (id: number) => api.get(`/api/users/${id}`),
  getUserWithToken: (id: number, token: string) =>
      api.get(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  train: (id: number, data: { stat: string; amount: number }) => api.post(`/api/users/${id}/train`, data),
  rest: (id: number, data: { amount: number }) => api.post(`/api/users/${id}/rest`, data),
  purchase: (id: number, data: { accessoryName: string }) => api.post(`/api/users/${id}/purchase`, data),
}

// Exercise API
export const exerciseAPI = {
  list: () => api.get("/api/exercises"),
  getById: (id: number) => api.get(`/api/exercises/${id}`),
  create: (data: {
    name: string
    category: string
    description: string
    enduranceImpact: number
    strengthImpact: number
    flexibilityImpact: number
  }) => api.post("/api/exercises", data),
  update: (
      id: number,
      data: {
        name: string
        category: string
        description: string
        enduranceImpact: number
        strengthImpact: number
        flexibilityImpact: number
      },
  ) => api.put(`/api/exercises/${id}`, data),
  delete: (id: number) => api.delete(`/api/exercises/${id}`),
}

// Routine API
export const routineAPI = {
  list: () => api.get("/api/routines"),
  getById: (id: number) => api.get(`/api/routines/${id}`),
  create: (data: { name: string; exercises: number[] }) => api.post("/api/routines", data),
  update: (id: number, data: { name: string; exercises: number[] }) => api.put(`/api/routines/${id}`, data),
  delete: (id: number) => api.delete(`/api/routines/${id}`),
}

// Admin API
export const adminAPI = {
  // User management
  listUsers: () => api.get("/api/admin/users"),
  getUserById: (id: number) => api.get(`/api/admin/users/${id}`),
  createUser: (data: { name: string; username: string; password: string; role: string }) =>
      api.post("/api/admin/users", data),
  updateUser: (id: number, data: { name?: string; username?: string; role?: string }) =>
      api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/api/admin/users/${id}`),
  changeUserRole: (id: number, role: string) => api.put(`/api/admin/users/${id}/role`, { role }),
  resetUserPassword: (id: number, newPassword: string) =>
      api.put(`/api/admin/users/${id}/password`, { password: newPassword }),
}
