"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userAPI } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Dumbbell, Heart, Zap, ShoppingBag } from "lucide-react"

const ACCESSORIES = [
  { name: "Cinturón de levantamiento", image: "/accessories/belt.png" },
  { name: "Guantes de gimnasio", image: "/accessories/gloves.png" },
  { name: "Cuerda para saltar", image: "/accessories/rope.png" },
  { name: "Toalla de entrenamiento", image: "/accessories/towel.png" },
  { name: "Pulsera de actividad", image: "/accessories/bracelet.png" },
  { name: "Auriculares Bluetooth", image: "/accessories/headphones.png" },
  { name: "Camisetas sin mangas", image: "/accessories/tank-top.png" },
  { name: "Mochila", image: "/accessories/backpack.png" },
  { name: "Botella reutilizable", image: "/accessories/bottle.png" },
  { name: 'Camiseta "No Pain No Gain"', image: "/accessories/tshirt.png" },
  { name: "Zapatillas", image: "/accessories/shoes.png" },
]

interface TrainingActionsProps {
  onStatTrained?: (stat: "strength" | "endurance" | "flexibility") => void
}

export function TrainingActions({ onStatTrained }: TrainingActionsProps) {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [stat, setStat] = useState("STRENGTH")
  const [trainAmount, setTrainAmount] = useState(10)
  const [restAmount, setRestAmount] = useState(5)
  const [selectedAccessory, setSelectedAccessory] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTrain = async () => {
    if (!user) return

    const statMap = {
      STRENGTH: user.strength,
      ENDURANCE: user.endurance,
      FLEXIBILITY: user.flexibility,
    }
    const currentStatValue = statMap[stat as keyof typeof statMap]

    setLoading(true)
    try {
      await userAPI.train(user.id, { stat, amount: trainAmount })
      await refreshUser()

      const statNameMap = {
        STRENGTH: "strength" as const,
        ENDURANCE: "endurance" as const,
        FLEXIBILITY: "flexibility" as const,
      }
      const trainedStat = statNameMap[stat as keyof typeof statNameMap]

      if (onStatTrained) {
        onStatTrained(trainedStat)
      }

      if (currentStatValue < 100) {
        const actualImprovement = Math.min(trainAmount, 100 - currentStatValue)
        toast({
          title: "¡Entrenamiento completado!",
          description: `Has mejorado tu ${stat.toLowerCase()} en ${actualImprovement} puntos.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al entrenar",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRest = async () => {
    if (!user) return
    setLoading(true)
    try {
      await userAPI.rest(user.id, { amount: restAmount })
      await refreshUser()
      toast({
        title: "¡Descanso completado!",
        description: `Has recuperado ${restAmount} puntos de energía.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al descansar",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!user || !selectedAccessory) return
    setLoading(true)
    try {
      await userAPI.purchase(user.id, { accessoryName: selectedAccessory })
      await refreshUser()
      toast({
        title: "¡Compra exitosa!",
        description: `Has comprado: ${selectedAccessory}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al comprar",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const totalStats = (user?.strength || 0) + (user?.endurance || 0) + (user?.flexibility || 0)
  const canRest = user && totalStats > 0

  return (
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Entrenar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Estadística</Label>
              <Select value={stat} onValueChange={setStat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STRENGTH">Fuerza</SelectItem>
                  <SelectItem value="ENDURANCE">Resistencia</SelectItem>
                  <SelectItem value="FLEXIBILITY">Flexibilidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cantidad</Label>
              <Input type="number" value={trainAmount} onChange={(e) => setTrainAmount(Number(e.target.value))} min={1} />
            </div>
            <Button onClick={handleTrain} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              <Zap className="h-4 w-4 mr-2" />
              Entrenar
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Descansar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Cantidad de recuperación</Label>
              <Input type="number" value={restAmount} onChange={(e) => setRestAmount(Number(e.target.value))} min={1} />
            </div>
            <Button
                onClick={handleRest}
                disabled={loading || !canRest}
                variant="secondary"
                className="w-full mt-auto"
                title={!canRest ? "Ya has tenido suficiente descanso" : ""}
            >
              <Heart className="h-4 w-4 mr-2" />
              Descansar
            </Button>
            {!canRest && <p className="text-xs text-destructive text-center">Ya has tenido suficiente descanso</p>}
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Comprar Accesorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Selecciona un accesorio</Label>
              <Select value={selectedAccessory} onValueChange={setSelectedAccessory}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige un accesorio..." />
                </SelectTrigger>
                <SelectContent>
                  {ACCESSORIES.map((accessory) => (
                      <SelectItem key={accessory.name} value={accessory.name}>
                        {accessory.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
                onClick={handlePurchase}
                disabled={loading || !selectedAccessory || user?.accessoryPurchased}
                variant="outline"
                className="w-full mt-auto bg-transparent"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {user?.accessoryPurchased ? "Ya compraste" : "Comprar"}
            </Button>
          </CardContent>
        </Card>
      </div>
  )
}
