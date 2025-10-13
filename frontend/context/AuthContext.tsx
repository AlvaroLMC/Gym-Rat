"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI, userAPI } from "@/lib/api"

interface User {
  id: number
  name: string
  username: string
  role: string
  strength: number
  endurance: number
  flexibility: number
  accessoryPurchased: boolean
  accessoryName?: string
  sessions: any[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (name: string, username: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password })
      const { token: newToken, id } = response.data

      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken)
      }
      setToken(newToken)

      const userResponse = await userAPI.getUserWithToken(id, newToken)
      const userData = userResponse.data

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData))
      }
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al iniciar sesión")
    }
  }

  const register = async (name: string, username: string, password: string) => {
    try {
      console.log("=== INICIO REGISTRO ===")
      console.log("Datos:", { name, username })

      const response = await authAPI.register({ name, username, password })
      console.log("Respuesta recibida:", response.data)

      const { token: newToken, id } = response.data
      console.log("Token y ID extraídos:", { id, tokenLength: newToken?.length })

      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken)
        console.log("Token guardado en localStorage")
      }
      setToken(newToken)

      console.log("Obteniendo datos del usuario...")
      const userResponse = await userAPI.getUserWithToken(id, newToken)
      console.log("Datos del usuario recibidos:", userResponse.data)

      const userData = userResponse.data

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData))
      }
      setUser(userData)

      console.log("=== REGISTRO EXITOSO ===")
    } catch (error: any) {
      console.error("=== ERROR EN REGISTRO ===")
      console.error("Error completo:", error)
      console.error("Mensaje:", error.message)
      console.error("Respuesta:", error.response?.data)
      console.error("Status:", error.response?.status)

      const errorMessage = error.response?.data?.message || error.message || "Error desconocido al registrarse"
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    if (user) {
      try {
        const response = await userAPI.getUser(user.id)
        const userData = response.data
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData))
        }
        setUser(userData)
      } catch (error) {
        console.error("Error al actualizar usuario:", error)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
