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
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exerciseAPI } from "@/lib/api"
import { useExercises } from "@/hooks/useCache"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2, Dumbbell } from "lucide-react"

interface Exercise {
  id: number
  name: string
  category: string
  description: string
  enduranceImpact: number
  strengthImpact: number
  flexibilityImpact: number
}

export default function ExercisesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const { exercises, isLoading: exercisesLoading, refresh } = useExercises()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [deleteExercise, setDeleteExercise] = useState<Exercise | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    enduranceImpact: 0,
    strengthImpact: 0,
    flexibilityImpact: 0,
  })

  const isAdmin = user?.role === "ADMIN"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingExercise) {
        await exerciseAPI.update(editingExercise.id, formData)
        toast({
          title: "¡Ejercicio actualizado!",
          description: `${formData.name} ha sido actualizado exitosamente`,
        })
      } else {
        await exerciseAPI.create(formData)
        toast({
          title: "¡Ejercicio creado!",
          description: `${formData.name} ha sido agregado exitosamente`,
        })
      }
      setDialogOpen(false)
      setEditingExercise(null)
      setFormData({
        name: "",
        category: "",
        description: "",
        enduranceImpact: 0,
        strengthImpact: 0,
        flexibilityImpact: 0,
      })
      refresh()
    } catch (error: any) {
      console.log("[v0] Error Response:", error.response)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al guardar ejercicio",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setFormData({
      name: exercise.name,
      category: exercise.category,
      description: exercise.description,
      enduranceImpact: exercise.enduranceImpact,
      strengthImpact: exercise.strengthImpact,
      flexibilityImpact: exercise.flexibilityImpact,
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteExercise) return
    try {
      await exerciseAPI.delete(deleteExercise.id)
      toast({
        title: "¡Ejercicio eliminado!",
        description: `${deleteExercise.name} ha sido eliminado exitosamente`,
      })
      setDeleteExercise(null)
      refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar ejercicio",
        variant: "destructive",
      })
    }
  }

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingExercise(null)
      setFormData({
        name: "",
        category: "",
        description: "",
        enduranceImpact: 0,
        strengthImpact: 0,
        flexibilityImpact: 0,
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
              <p className="text-muted-foreground text-lg">
                {isAdmin ? "Gestiona y explora ejercicios" : "Explora ejercicios para tu rutina"}
              </p>
            </div>
            {isAdmin && (
                <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2">
                      <Plus className="h-5 w-5" />
                      Nuevo Ejercicio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingExercise ? "Editar Ejercicio" : "Crear Nuevo Ejercicio"}</DialogTitle>
                      <DialogDescription>
                        {editingExercise ? "Modifica los datos del ejercicio" : "Define los datos del nuevo ejercicio"}
                      </DialogDescription>
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
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe el ejercicio..."
                            rows={3}
                            required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoría</Label>
                          <Select
                              value={formData.category}
                              onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="STRENGTH">Fuerza</SelectItem>
                              <SelectItem value="CARDIO">Cardio</SelectItem>
                              <SelectItem value="FLEXIBILITY">Flexibilidad</SelectItem>
                              <SelectItem value="BALANCE">Balance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base">Impacto en Estadísticas</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enduranceImpact" className="text-sm">
                              Resistencia
                            </Label>
                            <Input
                                id="enduranceImpact"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.enduranceImpact}
                                onChange={(e) => setFormData({ ...formData, enduranceImpact: Number(e.target.value) })}
                                required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="strengthImpact" className="text-sm">
                              Fuerza
                            </Label>
                            <Input
                                id="strengthImpact"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.strengthImpact}
                                onChange={(e) => setFormData({ ...formData, strengthImpact: Number(e.target.value) })}
                                required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="flexibilityImpact" className="text-sm">
                              Flexibilidad
                            </Label>
                            <Input
                                id="flexibilityImpact"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.flexibilityImpact}
                                onChange={(e) => setFormData({ ...formData, flexibilityImpact: Number(e.target.value) })}
                                required
                            />
                          </div>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingExercise ? "Actualizar Ejercicio" : "Crear Ejercicio"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
            )}
          </div>

          {exercisesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
          ) : exercises.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        {...exercise}
                        isAdmin={isAdmin}
                        onEdit={() => handleEdit(exercise)}
                        onDelete={() => setDeleteExercise(exercise)}
                    />
                ))}
              </div>
          ) : (
              <Card className="border-2">
                <CardContent className="py-12 text-center">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No hay ejercicios disponibles</p>
                  {isAdmin && (
                      <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Ejercicio
                      </Button>
                  )}
                </CardContent>
              </Card>
          )}
        </main>

        <AlertDialog open={!!deleteExercise} onOpenChange={() => setDeleteExercise(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El ejercicio "{deleteExercise?.name}" será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}
