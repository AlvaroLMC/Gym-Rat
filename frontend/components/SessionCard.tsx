import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Dumbbell, Heart, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

  const getSessionType = () => {
    const desc = description.toLowerCase()
    if (desc.includes("rested") || desc.includes("descanso")) {
      return {
        type: "Descanso",
        icon: Heart,
        gradient: "from-green-500/20 to-green-500/5",
        border: "border-green-500/50",
        iconColor: "text-green-500",
        badgeColor: "bg-green-500/20 text-green-500 border-green-500/30",
      }
    }
    if (desc.includes("fuerza") || desc.includes("strength")) {
      return {
        type: "Fuerza",
        icon: Dumbbell,
        gradient: "from-primary/20 to-primary/5",
        border: "border-primary/50",
        iconColor: "text-primary",
        badgeColor: "bg-primary/20 text-primary border-primary/30",
      }
    } else if (desc.includes("resistencia") || desc.includes("endurance")) {
      return {
        type: "Resistencia",
        icon: Heart,
        gradient: "from-chart-2/20 to-chart-2/5",
        border: "border-chart-2/50",
        iconColor: "text-chart-2",
        badgeColor: "bg-chart-2/20 text-chart-2 border-chart-2/30",
      }
    } else if (desc.includes("flexibilidad") || desc.includes("flexibility")) {
      return {
        type: "Flexibilidad",
        icon: Zap,
        gradient: "from-chart-3/20 to-chart-3/5",
        border: "border-chart-3/50",
        iconColor: "text-chart-3",
        badgeColor: "bg-chart-3/20 text-chart-3 border-chart-3/30",
      }
    }
    return {
      type: "Entrenamiento",
      icon: Dumbbell,
      gradient: "from-muted/20 to-muted/5",
      border: "border-muted",
      iconColor: "text-muted-foreground",
      badgeColor: "bg-muted text-muted-foreground",
    }
  }

  const sessionType = getSessionType()
  const Icon = sessionType.icon

  const translateDescription = (desc: string) => {
    const restedPattern = /Rested\s+by\s+(\d+)/i
    const restedMatch = desc.match(restedPattern)

    if (restedMatch) {
      const amount = restedMatch[1]
      return `Descanso +${amount} puntos de energía`
    }

    const trainedPattern = /Trained\s+(\w+)\s+by\s+(\d+)/i
    const match = desc.match(trainedPattern)

    if (match) {
      const stat = match[1].toLowerCase()
      const amount = match[2]

      const statTranslations: { [key: string]: string } = {
        strength: "fuerza",
        endurance: "resistencia",
        flexibility: "flexibilidad",
        fuerza: "fuerza",
        resistencia: "resistencia",
        flexibilidad: "flexibilidad",
      }

      const translatedStat = statTranslations[stat] || stat
      return `Entrenamiento de ${translatedStat} +${amount} puntos`
    }

    return desc
        .replace(/Trained/gi, "Entrenado")
        .replace(/Rested/gi, "Descansado")
        .replace(/strength/gi, "fuerza")
        .replace(/endurance/gi, "resistencia")
        .replace(/flexibility/gi, "flexibilidad")
        .replace(/training/gi, "entrenamiento")
        .replace(/completed/gi, "completado")
        .replace(/session/gi, "sesión")
        .replace(/by/gi, "por")
  }

  const translatedDescription = translateDescription(description)

  return (
      <Card
          className={`
        border-2 ${sessionType.border} 
        bg-white
        hover:shadow-lg hover:scale-[1.02] 
        transition-all duration-300
        hover:border-opacity-100
      `}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-background/50 border-2 ${sessionType.border}`}>
              <Icon className={`h-6 w-6 ${sessionType.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground mb-2 leading-tight">{translatedDescription}</p>
              <Badge variant="outline" className={`${sessionType.badgeColor} border`}>
                {sessionType.type}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-1.5 ${sessionType.iconColor} font-medium`}>
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className={`flex items-center gap-1.5 ${sessionType.iconColor} font-medium`}>
              <Clock className="h-4 w-4" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
