import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ListChecks } from "lucide-react"

interface Exercise {
  id: number
  name: string
}

interface RoutineCardProps {
  name: string
  exercises: Exercise[]
}

export function RoutineCard({ name, exercises }: RoutineCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all hover:scale-105 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          {name}
        </CardTitle>
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
