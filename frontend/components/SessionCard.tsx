import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

interface SessionCardProps {
  description: string
  timestamp: string
}

export function SessionCard({ description, timestamp }: SessionCardProps) {
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <p className="font-medium text-foreground mb-3">{description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formattedTime}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
