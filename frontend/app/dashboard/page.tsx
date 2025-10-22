"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/Navbar"
import { StatCard } from "@/components/StatCard"
import { TrainingActions } from "@/components/TrainingActions"
import { SessionCard } from "@/components/SessionCard"
import { OverTrainingAlert } from "@/components/OverTrainingAlert"
import { EnergyBar } from "@/components/EnergyBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Heart, Zap, Loader2 } from "lucide-react"

const ACCESSORIES = [
  { name: "Cinturón de levantamiento", image: "/gym-lifting-belt-accessory.jpg" },
  { name: "Guantes de gimnasio", image: "/gym-workout-gloves.jpg" },
  { name: "Cuerda para saltar", image: "/jump-rope-fitness-accessory.jpg" },
  { name: "Toalla de entrenamiento", image: "/gym-training-towel.jpg" },
  { name: "Pulsera de actividad", image: "/fitness-activity-tracker-bracelet.jpg" },
  { name: "Auriculares Bluetooth", image: "/bluetooth-wireless-headphones.jpg" },
  { name: "Camisetas sin mangas", image: "/gym-tank-top-sleeveless-shirt.jpg" },
  { name: "Mochila", image: "/gym-sports-backpack.jpg" },
  { name: "Botella reutilizable", image: "/reusable-water-bottle.png" },
  { name: 'Camiseta "No Pain No Gain"', image: "/no-pain-no-gain-gym-tshirt.jpg" },
  { name: "Zapatillas", image: "/athletic-training-shoes-sneakers.jpg" },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [lastTrainedStat, setLastTrainedStat] = useState<"strength" | "endurance" | "flexibility" | null>(null)
  const [closeAlert, setCloseAlert] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      console.log("[v0] Dashboard - User loaded:", {
        name: user.name,
        role: user.role,
        strength: user.strength,
        endurance: user.endurance,
        flexibility: user.flexibility,
      })
    }
  }, [user])

  if (isLoading || !user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const purchasedAccessory = ACCESSORIES.find((acc) => acc.name === user.accessoryName)

  const totalStats = (user?.strength || 0) + (user?.endurance || 0) + (user?.flexibility || 0)
  const totalEnergy = 300 - totalStats // Energía máxima (300) menos las estadísticas

  const handleAccessoryPurchased = () => {
    setCloseAlert(true)
    // Resetear después de un momento para permitir que la alerta se vuelva a mostrar si es necesario
    setTimeout(() => {
      setCloseAlert(false)
    }, 1000)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <Navbar />

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary to-secondary/80 p-8 md:p-12 text-secondary-foreground">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">¡Hola, {user.name}! 🦾</h1>
              <p className="text-xl text-secondary-foreground/90 max-w-2xl text-pretty">
                Bienvenido a tu espacio de entrenamiento. Sigue mejorando tus estadísticas y alcanza tus objetivos.
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-50">
              <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-09%20at%2012.34.38%283%29-kniT9oTPDSztZvxCjAHPuy4AxUeMvC.jpeg"
                  alt=""
                  className="h-full w-full object-cover"
              />
            </div>
          </div>

          <OverTrainingAlert
              stats={{
                strength: user.strength,
                endurance: user.endurance,
                flexibility: user.flexibility,
              }}
              lastTrainedStat={lastTrainedStat}
              shouldClose={closeAlert}
          />

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard title="Fuerza" value={user.strength} icon={Dumbbell} color="bg-primary" />
            <StatCard title="Resistencia" value={user.endurance} icon={Heart} color="bg-chart-2" />
            <StatCard title="Flexibilidad" value={user.flexibility} icon={Zap} color="bg-chart-3" />
          </div>

          {/* Training Actions */}
          <div>
            <EnergyBar currentEnergy={totalEnergy} maxEnergy={300} />

            <h2 className="text-2xl font-bold mb-6 mt-8">Acciones de Entrenamiento</h2>
            <TrainingActions onStatTrained={setLastTrainedStat} onAccessoryPurchased={handleAccessoryPurchased} />
          </div>

          {/* Recent Sessions */}
          <Card className="border-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/abstract-gym-pattern.png')] opacity-30 bg-cover bg-center" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl">Sesiones Recientes</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              {user.sessions && user.sessions.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {user.sessions.slice(0, 6).map((session) => (
                        <SessionCard key={session.id} description={session.description} timestamp={session.timestamp} />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aún no tienes sesiones de entrenamiento registradas</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
  )
}
