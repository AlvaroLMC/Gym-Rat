"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOTIVATIONAL_PHRASES = {
  strength: [
    "El descanso también es parte del progreso",
    "Los músculos crecen durante el descanso, no durante el entrenamiento",
    "La fuerza real viene de saber cuándo parar",
    "Un guerrero sabe cuándo descansar para volver más fuerte",
    "El sobreentrenamiento es el enemigo del progreso muscular",
  ],
  endurance: [
    "Escucha a tu cuerpo, es sabio",
    "La resistencia se construye con descanso inteligente",
    "Recuperarse es tan importante como entrenar",
    "Tu corazón también necesita descansar",
    "La verdadera resistencia incluye saber cuándo parar",
  ],
  flexibility: [
    "La flexibilidad requiere paciencia y descanso",
    "Los músculos se estiran mejor cuando están descansados",
    "El exceso de estiramiento puede causar lesiones",
    "La flexibilidad es un viaje, no una carrera",
    "Dale tiempo a tu cuerpo para adaptarse",
  ],
}

const ALERT_MESSAGES = {
  strength: "¡No te excedas en el entrenamiento de fuerza! 💪",
  endurance: "¡Cuidado con el exceso de resistencia! 🏃",
  flexibility: "¡No fuerces demasiado tu flexibilidad! 🧘",
}

const ALERT_IMAGES = {
  strength: "/motivational-strength.jpg",
  endurance: "/motivational-endurance.jpg",
  flexibility: "/motivational-flexibility.jpg",
}

interface OverTrainingAlertProps {
  stats: {
    strength: number
    endurance: number
    flexibility: number
  }
  lastTrainedStat?: "strength" | "endurance" | "flexibility" | null
}

export function OverTrainingAlert({ stats, lastTrainedStat }: OverTrainingAlertProps) {
  const [show, setShow] = useState(false)
  const [alertType, setAlertType] = useState<"strength" | "endurance" | "flexibility">("strength")
  const [phrase, setPhrase] = useState("")

  useEffect(() => {
    const overTrainingStats: Array<"strength" | "endurance" | "flexibility"> = []

    if (stats.strength >= 100) overTrainingStats.push("strength")
    if (stats.endurance >= 100) overTrainingStats.push("endurance")
    if (stats.flexibility >= 100) overTrainingStats.push("flexibility")

    if (overTrainingStats.length > 0) {
      setShow(true)

      let selectedType: "strength" | "endurance" | "flexibility"

      if (lastTrainedStat && overTrainingStats.includes(lastTrainedStat)) {
        selectedType = lastTrainedStat
      } else {
        selectedType = overTrainingStats[0]
      }

      setAlertType(selectedType)

      const phrases = MOTIVATIONAL_PHRASES[selectedType]
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
      setPhrase(randomPhrase)
    } else {
      setShow(false)
    }
  }, [stats, lastTrainedStat])

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-destructive/20 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">{ALERT_MESSAGES[alertType]}</DialogTitle>
          <DialogDescription className="text-center text-base italic pt-2">{phrase}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full">
            <img
              src={ALERT_IMAGES[alertType] || "/placeholder.svg"}
              alt="Descanso motivacional"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/motivational-gym-rest-illustration.jpg"
              }}
            />
          </div>
          <Button onClick={() => setShow(false)} className="w-full" variant="outline">
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
