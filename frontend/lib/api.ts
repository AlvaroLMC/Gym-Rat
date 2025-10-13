import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

console.log("[v0] API Base URL:", API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const authHeader = config.headers.Authorization
    const authHeaderPreview =
      authHeader && typeof authHeader === "string"
        ? authHeader.substring(0, 27) + "..."
        : authHeader
          ? "Present (non-string)"
          : "None"

    console.log("[v0] Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      authHeader: authHeaderPreview,
    })

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log("[v0] Response:", {
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error("[v0] Error Response:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
      requestURL: error.config?.url,
      requestMethod: error.config?.method,
      requestAuthHeader: error.config?.headers?.Authorization ? "Present" : "Missing",
    })

    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth endpoints
export const authAPI = {
  register: (data: { name: string; username: string; password: string }) => api.post("/api/auth/register", data),
  login: (data: { username: string; password: string }) => api.post("/api/auth/login", data),
}

// User endpoints
export const userAPI = {
  getUser: (id: number) => api.get(`/api/users/${id}`),
  getUserWithToken: (id: number, token: string) => {
    console.log("[v0] getUserWithToken called with:", {
      userId: id,
      tokenLength: token?.length,
      tokenPreview: token?.substring(0, 20) + "...",
    })
    return api.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
  train: (id: number, data: { stat: string; amount: number }) => api.post(`/api/users/${id}/train`, data),
  rest: (id: number, data: { amount: number }) => api.post(`/api/users/${id}/rest`, data),
  purchase: (id: number, data: { accessoryName: string }) => api.post(`/api/users/${id}/purchase`, data),
  addSession: (id: number, data: { description: string }) => api.post(`/api/users/${id}/sessions`, data),
  getSessions: (id: number) => api.get(`/api/users/${id}/sessions`),
}

// Exercise endpoints
export const exerciseAPI = {
  list: () => api.get("/api/exercises"),
  create: (data: {
    name: string
    description: string
    strengthImpact: number
    enduranceImpact: number
    flexibilityImpact: number
  }) => api.post("/api/exercises", data),
}

// Routine endpoints
export const routineAPI = {
  list: () => api.get("/api/routines"),
  create: (data: { name: string; exercises: number[] }) => api.post("/api/routines", data),
}

export default api
