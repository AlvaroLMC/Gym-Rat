import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Heart, Zap } from "lucide-react"

interface ExerciseCardProps {
  name: string
  description: string
  strengthImpact: number
  enduranceImpact: number
  flexibilityImpact: number
}

export function ExerciseCard({
  name,
  description,
  strengthImpact,
  enduranceImpact,
  flexibilityImpact,
}: ExerciseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all hover:scale-105 border-2">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {strengthImpact > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Dumbbell className="h-3 w-3" />
              Fuerza +{strengthImpact}
            </Badge>
          )}
          {enduranceImpact > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Heart className="h-3 w-3" />
              Resistencia +{enduranceImpact}
            </Badge>
          )}
          {flexibilityImpact > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              Flexibilidad +{flexibilityImpact}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
