"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/Navbar"
import { ExerciseCard } from "@/components/ExerciseCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { exerciseAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2, Dumbbell } from "lucide-react"

interface Exercise {
  id: number
  name: string
  description: string
  strengthImpact: number
  enduranceImpact: number
  flexibilityImpact: number
}

export default function ExercisesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    strengthImpact: 0,
    enduranceImpact: 0,
    flexibilityImpact: 0,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    try {
      const response = await exerciseAPI.list()
      setExercises(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los ejercicios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await exerciseAPI.create(formData)
      toast({
        title: "¡Ejercicio creado!",
        description: `${formData.name} ha sido agregado exitosamente`,
      })
      setDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        strengthImpact: 0,
        enduranceImpact: 0,
        flexibilityImpact: 0,
      })
      loadExercises()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear ejercicio",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Ejercicios</h1>
            <p className="text-muted-foreground text-lg">Explora y crea ejercicios para tu rutina</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Nuevo Ejercicio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Ejercicio</DialogTitle>
                <DialogDescription>Define los impactos del ejercicio en cada estadística</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="strength">Fuerza</Label>
                    <Input
                      id="strength"
                      type="number"
                      min="0"
                      value={formData.strengthImpact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          strengthImpact: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endurance">Resistencia</Label>
                    <Input
                      id="endurance"
                      type="number"
                      min="0"
                      value={formData.enduranceImpact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          enduranceImpact: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flexibility">Flexibilidad</Label>
                    <Input
                      id="flexibility"
                      type="number"
                      min="0"
                      value={formData.flexibilityImpact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          flexibilityImpact: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Crear Ejercicio
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : exercises.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} {...exercise} />
            ))}
          </div>
        ) : (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No hay ejercicios disponibles</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Ejercicio
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
