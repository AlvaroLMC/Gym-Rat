"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListChecks, Pencil, Trash2 } from "lucide-react"

interface Exercise {
    id: number
    name: string
}

interface RoutineCardProps {
    name: string
    exercises: Exercise[]
    onEdit?: () => void
    onDelete?: () => void
}

export function RoutineCard({ name, exercises, onEdit, onDelete }: RoutineCardProps) {
    return (
        <Card className="hover:shadow-lg transition-all hover:scale-105 border-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-primary" />
                        {name}
                    </CardTitle>
                    {(onEdit || onDelete) && (
                        <div className="flex gap-2">
                            {onEdit && (
                                <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                        {exercises.length} ejercicio{exercises.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {exercises.map((exercise) => (
                            <Badge key={exercise.id} variant="outline">
                                {exercise.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
