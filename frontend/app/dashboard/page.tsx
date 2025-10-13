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
import { Dumbbell, Heart, Zap, TrendingUp, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [lastTrainedStat, setLastTrainedStat] = useState<"strength" | "endurance" | "flexibility" | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const purchasedAccessory = ACCESSORIES.find((acc) => acc.name === user.accessoryName)

  const totalEnergy = (user?.strength || 0) + (user?.endurance || 0) + (user?.flexibility || 0)

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <Navbar />

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary to-secondary/80 p-8 md:p-12 text-secondary-foreground">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">¡Hola, {user.name}! 💪</h1>
              <p className="text-xl text-secondary-foreground/90 max-w-2xl text-pretty">
                Bienvenido a tu espacio de entrenamiento. Sigue mejorando tus estadísticas y alcanza tus objetivos.
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
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
          />

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard title="Fuerza" value={user.strength} icon={Dumbbell} color="bg-primary" />
            <StatCard title="Resistencia" value={user.endurance} icon={Heart} color="bg-chart-2" />
            <StatCard title="Flexibilidad" value={user.flexibility} icon={Zap} color="bg-chart-3" />
          </div>

          {user.accessoryPurchased && purchasedAccessory && (
              <Card className="border-2 border-primary/50 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary/10 p-4 rounded-xl border-2 border-primary/30">
                      <img
                          src={purchasedAccessory.image || "/placeholder.svg"}
                          alt={purchasedAccessory.name}
                          className="h-20 w-20 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{purchasedAccessory.name}</p>
                      <p className="text-muted-foreground">Accesorio equipado que mejora tu rendimiento</p>
                    </div>
                    <Badge className="ml-auto" variant="secondary">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Activo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
          )}

          {/* Training Actions */}
          <div>
            <EnergyBar currentEnergy={totalEnergy} maxEnergy={300} />

            <h2 className="text-2xl font-bold mb-6 mt-8">Acciones de Entrenamiento</h2>
            <TrainingActions onStatTrained={setLastTrainedStat} />
          </div>

          {/* Recent Sessions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Sesiones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
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
