"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  if (typeof window !== "undefined") {
    console.log("🔴 COMPONENTE REGISTER RENDERIZADO")
  }

  const router = useRouter()
  const { register } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    alert("🔴 SUBMIT EJECUTADO - Revisa la consola")
    console.log("🔴 ========================================")
    console.log("🔴 HANDLE SUBMIT EJECUTADO")
    console.log("🔴 Valores:", { name, username, password: "***" })
    console.log("🔴 ========================================")

    if (!name || !username || !password || !confirmPassword) {
      console.log("🔴 Validación fallida: campos vacíos")
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      console.log("🔴 Validación fallida: contraseñas no coinciden")
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (password.length < 8) {
      console.log("🔴 Validación fallida: contraseña muy corta")
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      })
      return
    }

    console.log("🔴 Validaciones pasadas, iniciando registro...")
    setLoading(true)

    try {
      console.log("🔴 === LLAMANDO A REGISTER ===")
      await register(name, username, password)

      console.log("🔴 === REGISTRO EXITOSO ===")
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.log("🔴 ========================================")
      console.log("🔴 ERROR EN REGISTRO")
      console.log("🔴 ========================================")
      console.error("🔴 Error:", error)
      console.error("🔴 Mensaje:", error?.message)

      alert("🔴 ERROR: " + (error?.message || "Error desconocido"))

      toast({
        title: "Error",
        description: error?.message || "Ocurrió un error al crear la cuenta",
        variant: "destructive",
      })
    } finally {
      console.log("🔴 Finalizando registro")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="absolute inset-0 bg-[url('/abstract-gym-pattern.png')] opacity-5 bg-cover bg-center" />

      <Card className="w-full max-w-md relative z-10 border-2 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-primary p-4 rounded-2xl w-fit animate-pulse-glow">
            <Dumbbell className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Únete a Gym Rat
            </CardTitle>
            <CardDescription className="text-base mt-2">Crea tu cuenta y comienza tu transformación</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="juanperez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
