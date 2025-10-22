"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dumbbell, Pencil, Trash2, Activity, Zap, Wind } from "lucide-react"

interface ExerciseCardProps {
  name: string
  category: string
  description: string
  enduranceImpact: number
  strengthImpact: number
  flexibilityImpact: number
  isAdmin?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ExerciseCard({
                               name,
                               category,
                               description,
                               enduranceImpact,
                               strengthImpact,
                               flexibilityImpact,
                               isAdmin,
                               onEdit,
                               onDelete,
                             }: ExerciseCardProps) {
  const categoryLabels: Record<string, string> = {
    STRENGTH: "Fuerza",
    CARDIO: "Cardio",
    FLEXIBILITY: "Flexibilidad",
    BALANCE: "Balance",
  }

  return (
      <Card className="hover:shadow-lg transition-all hover:scale-105 border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              {name}
            </CardTitle>
            {isAdmin && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={onDelete}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
            )}
          </div>
          <CardDescription className="text-sm mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              {categoryLabels[category] || category}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="flex flex-col items-center gap-1">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Resistencia</span>
              <span className="text-sm font-semibold">{enduranceImpact}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Fuerza</span>
              <span className="text-sm font-semibold">{strengthImpact}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wind className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Flexibilidad</span>
              <span className="text-sm font-semibold">{flexibilityImpact}</span>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
