"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/Navbar"
import { RoutineCard } from "@/components/RoutineCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { routineAPI, exerciseAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2, ListChecks } from "lucide-react"

interface Exercise {
  id: number
  name: string
}

interface Routine {
  id: number
  name: string
  exercises: Exercise[]
}

export default function RoutinesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [routineName, setRoutineName] = useState("")
  const [selectedExercises, setSelectedExercises] = useState<number[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [routinesRes, exercisesRes] = await Promise.all([routineAPI.list(), exerciseAPI.list()])
      setRoutines(routinesRes.data)
      setExercises(exercisesRes.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!routineName || selectedExercises.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar un nombre y al menos un ejercicio",
        variant: "destructive",
      })
      return
    }

    try {
      await routineAPI.create({ name: routineName, exercises: selectedExercises })
      toast({
        title: "¡Rutina creada!",
        description: `${routineName} ha sido creada exitosamente`,
      })
      setDialogOpen(false)
      setRoutineName("")
      setSelectedExercises([])
      loadData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear rutina",
        variant: "destructive",
      })
    }
  }

  const toggleExercise = (exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId],
    )
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
            <h1 className="text-4xl font-bold mb-2">Rutinas</h1>
            <p className="text-muted-foreground text-lg">Organiza tus ejercicios en rutinas personalizadas</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Nueva Rutina
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Rutina</DialogTitle>
                <DialogDescription>Selecciona los ejercicios que formarán parte de tu rutina</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="routineName">Nombre de la rutina</Label>
                  <Input
                    id="routineName"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    placeholder="Ej: Rutina de fuerza"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Ejercicios</Label>
                  {exercises.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                      {exercises.map((exercise) => (
                        <div key={exercise.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`exercise-${exercise.id}`}
                            checked={selectedExercises.includes(exercise.id)}
                            onCheckedChange={() => toggleExercise(exercise.id)}
                          />
                          <label
                            htmlFor={`exercise-${exercise.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {exercise.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hay ejercicios disponibles. Crea algunos primero.
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={exercises.length === 0}>
                  Crear Rutina
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : routines.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {routines.map((routine) => (
              <RoutineCard key={routine.id} {...routine} />
            ))}
          </div>
        ) : (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <ListChecks className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No hay rutinas disponibles</p>
              <Button onClick={() => setDialogOpen(true)} disabled={exercises.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Rutina
              </Button>
              {exercises.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">Primero necesitas crear algunos ejercicios</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
