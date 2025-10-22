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
  { name: "Cinturón de levantamiento", image: "/accessories/belt.jpg" },
  { name: "Guantes de gimnasio", image: "/accessories/gloves.jpg" },
  { name: "Cuerda para saltar", image: "/accessories/rope.jpg" },
  { name: "Toalla de entrenamiento", image: "/accessories/towel.jpg" },
  { name: "Pulsera de actividad", image: "/accessories/bracelet.jpg" },
  { name: "Auriculares Bluetooth", image: "/accessories/headphones.jpg" },
  { name: "Camisetas sin mangas", image: "/accessories/tank-top.jpg" },
  { name: "Mochila", image: "/accessories/backpack.jpg" },
  { name: "Botella reutilizable", image: "/accessories/bottle.jpg" },
  { name: 'Camiseta "No Pain No Gain"', image: "/accessories/tshirt.jpg" },
  { name: "Zapatillas", image: "/accessories/shoes.jpg" },
]

interface TrainingActionsProps {
  onStatTrained?: (stat: "strength" | "endurance" | "flexibility") => void
  onAccessoryPurchased?: () => void
}

export function TrainingActions({ onStatTrained, onAccessoryPurchased }: TrainingActionsProps) {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [stat, setStat] = useState("STRENGTH")
  const [trainAmount, setTrainAmount] = useState(10)
  const [restAmount, setRestAmount] = useState(5)
  const [selectedAccessory, setSelectedAccessory] = useState("")
  const [loading, setLoading] = useState(false)
  const [tempAccessory, setTempAccessory] = useState<{ name: string; image: string } | null>(null)
  const [showRestImage, setShowRestImage] = useState(false)

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

      console.log("[v0] TrainingActions - Trained stat:", trainedStat)

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

      setShowRestImage(true)
      setTimeout(() => {
        setShowRestImage(false)
      }, 5000)

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

      const purchasedAccessory = ACCESSORIES.find((acc) => acc.name === selectedAccessory)
      console.log("[v0] TrainingActions - Purchased accessory:", purchasedAccessory)

      if (purchasedAccessory) {
        setTempAccessory(purchasedAccessory)
        setTimeout(() => {
          setTempAccessory(null)
        }, 5000)
      }

      if (onAccessoryPurchased) {
        console.log("[v0] TrainingActions - Calling onAccessoryPurchased")
        onAccessoryPurchased()
      }

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

  const allStatsMaxed = user && user.strength === 100 && user.endurance === 100 && user.flexibility === 100
  const canPurchase = allStatsMaxed && !user?.accessoryPurchased && selectedAccessory

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
            {showRestImage ? (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-500">
                  <img
                      src="/descansar.png"
                      alt="Descansando"
                      className="h-60 w-60 object-contain border-4 border-primary rounded-xl p-2 bg-primary/10 shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                      onError={(e) => {
                        e.currentTarget.src = "/person-resting.jpg"
                      }}
                  />
                  <p className="mt-4 text-lg font-semibold text-center text-primary">¡Descansando!</p>
                </div>
            ) : (
                <>
                  <div>
                    <Label>Cantidad de recuperación</Label>
                    <Input
                        type="number"
                        value={restAmount}
                        onChange={(e) => setRestAmount(Number(e.target.value))}
                        min={1}
                    />
                  </div>
                  <Button
                      onClick={handleRest}
                      disabled={loading || !canRest}
                      variant="secondary"
                      className="w-full mt-auto"
                      title={!canRest ? "No puedes exceder el descanso, activate!" : ""}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Descansar
                  </Button>
                  {!canRest && <p className="text-xs text-destructive text-center">No puedes exceder el descanso, activate!</p>}
                </>
            )}
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
            {tempAccessory ? (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-500">
                  <img
                      src={tempAccessory.image || "/placeholder.svg"}
                      alt={tempAccessory.name}
                      className="h-40 w-40 object-contain border-4 border-primary rounded-xl p-2 bg-primary/10 shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                      onError={(e) => {
                        console.log("[v0] TrainingActions - Image load error for:", tempAccessory.name)
                        e.currentTarget.src = "/placeholder.sv\"use client\"\n" +
                            "\n" +
                            "import { useState } from \"react\"\n" +
                            "import { Button } from \"@/components/ui/button\"\n" +
                            "import { Card, CardContent, CardHeader, CardTitle } from \"@/components/ui/card\"\n" +
                            "import { Label } from \"@/components/ui/label\"\n" +
                            "import { Input } from \"@/components/ui/input\"\n" +
                            "import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from \"@/components/ui/select\"\n" +
                            "import { userAPI } from \"@/lib/api\"\n" +
                            "import { useAuth } from \"@/context/AuthContext\"\n" +
                            "import { useToast } from \"@/hooks/use-toast\"\n" +
                            "import { Dumbbell, Heart, Zap, ShoppingBag } from \"lucide-react\"\n" +
                            "\n" +
                            "const ACCESSORIES = [\n" +
                            "  { name: \"Cinturón de levantamiento\", image: \"/accessories/belt.jpg\" },\n" +
                            "  { name: \"Guantes de gimnasio\", image: \"/accessories/gloves.jpg\" },\n" +
                            "  { name: \"Cuerda para saltar\", image: \"/accessories/rope.jpg\" },\n" +
                            "  { name: \"Toalla de entrenamiento\", image: \"/accessories/towel.jpg\" },\n" +
                            "  { name: \"Pulsera de actividad\", image: \"/accessories/bracelet.jpg\" },\n" +
                            "  { name: \"Auriculares Bluetooth\", image: \"/accessories/headphones.jpg\" },\n" +
                            "  { name: \"Camisetas sin mangas\", image: \"/accessories/tank-top.jpg\" },\n" +
                            "  { name: \"Mochila\", image: \"/accessories/backpack.jpg\" },\n" +
                            "  { name: \"Botella reutilizable\", image: \"/accessories/bottle.jpg\" },\n" +
                            "  { name: 'Camiseta \"No Pain No Gain\"', image: \"/accessories/tshirt.jpg\" },\n" +
                            "  { name: \"Zapatillas\", image: \"/accessories/shoes.jpg\" },\n" +
                            "]\n" +
                            "\n" +
                            "interface TrainingActionsProps {\n" +
                            "  onStatTrained?: (stat: \"strength\" | \"endurance\" | \"flexibility\") => void\n" +
                            "  onAccessoryPurchased?: () => void\n" +
                            "}\n" +
                            "\n" +
                            "export function TrainingActions({ onStatTrained, onAccessoryPurchased }: TrainingActionsProps) {\n" +
                            "  const { user, refreshUser } = useAuth()\n" +
                            "  const { toast } = useToast()\n" +
                            "  const [stat, setStat] = useState(\"STRENGTH\")\n" +
                            "  const [trainAmount, setTrainAmount] = useState(10)\n" +
                            "  const [restAmount, setRestAmount] = useState(5)\n" +
                            "  const [selectedAccessory, setSelectedAccessory] = useState(\"\")\n" +
                            "  const [loading, setLoading] = useState(false)\n" +
                            "  const [tempAccessory, setTempAccessory] = useState<{ name: string; image: string } | null>(null)\n" +
                            "  const [showRestImage, setShowRestImage] = useState(false)\n" +
                            "\n" +
                            "  const handleTrain = async () => {\n" +
                            "    if (!user) return\n" +
                            "\n" +
                            "    const statMap = {\n" +
                            "      STRENGTH: user.strength,\n" +
                            "      ENDURANCE: user.endurance,\n" +
                            "      FLEXIBILITY: user.flexibility,\n" +
                            "    }\n" +
                            "    const currentStatValue = statMap[stat as keyof typeof statMap]\n" +
                            "\n" +
                            "    setLoading(true)\n" +
                            "    try {\n" +
                            "      await userAPI.train(user.id, { stat, amount: trainAmount })\n" +
                            "      await refreshUser()\n" +
                            "\n" +
                            "      const statNameMap = {\n" +
                            "        STRENGTH: \"strength\" as const,\n" +
                            "        ENDURANCE: \"endurance\" as const,\n" +
                            "        FLEXIBILITY: \"flexibility\" as const,\n" +
                            "      }\n" +
                            "      const trainedStat = statNameMap[stat as keyof typeof statNameMap]\n" +
                            "\n" +
                            "      console.log(\"[v0] TrainingActions - Trained stat:\", trainedStat)\n" +
                            "\n" +
                            "      if (onStatTrained) {\n" +
                            "        onStatTrained(trainedStat)\n" +
                            "      }\n" +
                            "\n" +
                            "      if (currentStatValue < 100) {\n" +
                            "        const actualImprovement = Math.min(trainAmount, 100 - currentStatValue)\n" +
                            "        toast({\n" +
                            "          title: \"¡Entrenamiento completado!\",\n" +
                            "          description: `Has mejorado tu ${stat.toLowerCase()} en ${actualImprovement} puntos.`,\n" +
                            "        })\n" +
                            "      }\n" +
                            "    } catch (error: any) {\n" +
                            "      toast({\n" +
                            "        title: \"Error\",\n" +
                            "        description: error.response?.data?.message || \"Error al entrenar\",\n" +
                            "        variant: \"destructive\",\n" +
                            "      })\n" +
                            "    } finally {\n" +
                            "      setLoading(false)\n" +
                            "    }\n" +
                            "  }\n" +
                            "\n" +
                            "  const handleRest = async () => {\n" +
                            "    if (!user) return\n" +
                            "    setLoading(true)\n" +
                            "    try {\n" +
                            "      await userAPI.rest(user.id, { amount: restAmount })\n" +
                            "      await refreshUser()\n" +
                            "\n" +
                            "      setShowRestImage(true)\n" +
                            "      setTimeout(() => {\n" +
                            "        setShowRestImage(false)\n" +
                            "      }, 5000)\n" +
                            "\n" +
                            "      toast({\n" +
                            "        title: \"¡Descanso completado!\",\n" +
                            "        description: `Has recuperado ${restAmount} puntos de energía.`,\n" +
                            "      })\n" +
                            "    } catch (error: any) {\n" +
                            "      toast({\n" +
                            "        title: \"Error\",\n" +
                            "        description: error.response?.data?.message || \"Error al descansar\",\n" +
                            "        variant: \"destructive\",\n" +
                            "      })\n" +
                            "    } finally {\n" +
                            "      setLoading(false)\n" +
                            "    }\n" +
                            "  }\n" +
                            "\n" +
                            "  const handlePurchase = async () => {\n" +
                            "    if (!user || !selectedAccessory) return\n" +
                            "    setLoading(true)\n" +
                            "    try {\n" +
                            "      await userAPI.purchase(user.id, { accessoryName: selectedAccessory })\n" +
                            "      await refreshUser()\n" +
                            "\n" +
                            "      const purchasedAccessory = ACCESSORIES.find((acc) => acc.name === selectedAccessory)\n" +
                            "      console.log(\"[v0] TrainingActions - Purchased accessory:\", purchasedAccessory)\n" +
                            "\n" +
                            "      if (purchasedAccessory) {\n" +
                            "        setTempAccessory(purchasedAccessory)\n" +
                            "        setTimeout(() => {\n" +
                            "          setTempAccessory(null)\n" +
                            "        }, 5000)\n" +
                            "      }\n" +
                            "\n" +
                            "      if (onAccessoryPurchased) {\n" +
                            "        console.log(\"[v0] TrainingActions - Calling onAccessoryPurchased\")\n" +
                            "        onAccessoryPurchased()\n" +
                            "      }\n" +
                            "\n" +
                            "      toast({\n" +
                            "        title: \"¡Compra exitosa!\",\n" +
                            "        description: `Has comprado: ${selectedAccessory}`,\n" +
                            "      })\n" +
                            "    } catch (error: any) {\n" +
                            "      toast({\n" +
                            "        title: \"Error\",\n" +
                            "        description: error.response?.data?.message || \"Error al comprar\",\n" +
                            "        variant: \"destructive\",\n" +
                            "      })\n" +
                            "    } finally {\n" +
                            "      setLoading(false)\n" +
                            "    }\n" +
                            "  }\n" +
                            "\n" +
                            "  const totalStats = (user?.strength || 0) + (user?.endurance || 0) + (user?.flexibility || 0)\n" +
                            "  const canRest = user && totalStats > 0\n" +
                            "\n" +
                            "  const allStatsMaxed = user && user.strength === 100 && user.endurance === 100 && user.flexibility === 100\n" +
                            "  const canPurchase = allStatsMaxed && !user?.accessoryPurchased && selectedAccessory\n" +
                            "\n" +
                            "  return (\n" +
                            "    <div className=\"grid gap-6 md:grid-cols-3\">\n" +
                            "      <Card className=\"border-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300\">\n" +
                            "        <CardHeader>\n" +
                            "          <CardTitle className=\"flex items-center gap-2\">\n" +
                            "            <Dumbbell className=\"h-5 w-5 text-primary\" />\n" +
                            "            Entrenar\n" +
                            "          </CardTitle>\n" +
                            "        </CardHeader>\n" +
                            "        <CardContent className=\"space-y-4\">\n" +
                            "          <div>\n" +
                            "            <Label>Estadística</Label>\n" +
                            "            <Select value={stat} onValueChange={setStat}>\n" +
                            "              <SelectTrigger>\n" +
                            "                <SelectValue />\n" +
                            "              </SelectTrigger>\n" +
                            "              <SelectContent>\n" +
                            "                <SelectItem value=\"STRENGTH\">Fuerza</SelectItem>\n" +
                            "                <SelectItem value=\"ENDURANCE\">Resistencia</SelectItem>\n" +
                            "                <SelectItem value=\"FLEXIBILITY\">Flexibilidad</SelectItem>\n" +
                            "              </SelectContent>\n" +
                            "            </Select>\n" +
                            "          </div>\n" +
                            "          <div>\n" +
                            "            <Label>Cantidad</Label>\n" +
                            "            <Input type=\"number\" value={trainAmount} onChange={(e) => setTrainAmount(Number(e.target.value))} min={1} />\n" +
                            "          </div>\n" +
                            "          <Button onClick={handleTrain} disabled={loading} className=\"w-full bg-primary hover:bg-primary/90\">\n" +
                            "            <Zap className=\"h-4 w-4 mr-2\" />\n" +
                            "            Entrenar\n" +
                            "          </Button>\n" +
                            "        </CardContent>\n" +
                            "      </Card>\n" +
                            "\n" +
                            "      <Card className=\"border-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300\">\n" +
                            "        <CardHeader>\n" +
                            "          <CardTitle className=\"flex items-center gap-2\">\n" +
                            "            <Heart className=\"h-5 w-5 text-primary\" />\n" +
                            "            Descansar\n" +
                            "          </CardTitle>\n" +
                            "        </CardHeader>\n" +
                            "        <CardContent className=\"space-y-4\">\n" +
                            "          {showRestImage ? (\n" +
                            "            <div className=\"flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-500\">\n" +
                            "              <img\n" +
                            "                src=\"/descansar.png\"\n" +
                            "                alt=\"Descansando\"\n" +
                            "                className=\"h-30 w-30 object-contain border-4 border-primary rounded-xl p-2 bg-primary/10 shadow-[0_0_30px_rgba(0,255,255,0.6)]\"\n" +
                            "                onError={(e) => {\n" +
                            "                  e.currentTarget.src = \"/person-resting.jpg\"\n" +
                            "                }}\n" +
                            "              />\n" +
                            "              <p className=\"mt-4 text-lg font-semibold text-center text-primary\">¡Descansando!</p>\n" +
                            "            </div>\n" +
                            "          ) : (\n" +
                            "            <>\n" +
                            "              <div>\n" +
                            "                <Label>Cantidad de recuperación</Label>\n" +
                            "                <Input\n" +
                            "                  type=\"number\"\n" +
                            "                  value={restAmount}\n" +
                            "                  onChange={(e) => setRestAmount(Number(e.target.value))}\n" +
                            "                  min={1}\n" +
                            "                />\n" +
                            "              </div>\n" +
                            "              <Button\n" +
                            "                onClick={handleRest}\n" +
                            "                disabled={loading || !canRest}\n" +
                            "                variant=\"secondary\"\n" +
                            "                className=\"w-full mt-auto\"\n" +
                            "                title={!canRest ? \"No puedes exceder el descanso, activate!\" : \"\"}\n" +
                            "              >\n" +
                            "                <Heart className=\"h-4 w-4 mr-2\" />\n" +
                            "                Descansar\n" +
                            "              </Button>\n" +
                            "              {!canRest && <p className=\"text-xs text-destructive text-center\">No puedes exceder el descanso, activate! </p>}\n" +
                            "            </>\n" +
                            "          )}\n" +
                            "        </CardContent>\n" +
                            "      </Card>\n" +
                            "\n" +
                            "      <Card className=\"border-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300\">\n" +
                            "        <CardHeader>\n" +
                            "          <CardTitle className=\"flex items-center gap-2\">\n" +
                            "            <ShoppingBag className=\"h-5 w-5 text-primary\" />\n" +
                            "            Comprar Accesorio\n" +
                            "          </CardTitle>\n" +
                            "        </CardHeader>\n" +
                            "        <CardContent className=\"space-y-4\">\n" +
                            "          {tempAccessory ? (\n" +
                            "            <div className=\"flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-500\">\n" +
                            "              <img\n" +
                            "                src={tempAccessory.image || \"/placeholder.svg\"}\n" +
                            "                alt={tempAccessory.name}\n" +
                            "                className=\"h-30 w-30 object-contain border-4 border-primary rounded-xl p-2 bg-primary/10 shadow-[0_0_30px_rgba(0,255,255,0.6)]\"\n" +
                            "                onError={(e) => {\n" +
                            "                  console.log(\"[v0] TrainingActions - Image load error for:\", tempAccessory.name)\n" +
                            "                  e.currentTarget.src = \"/placeholder.svg?height=240&width=240\"\n" +
                            "                }}\n" +
                            "              />\n" +
                            "              <p className=\"mt-4 text-lg font-semibold text-center text-primary\">{tempAccessory.name}</p>\n" +
                            "            </div>\n" +
                            "          ) : (\n" +
                            "            <>\n" +
                            "              <div>\n" +
                            "                <Label>Selecciona un accesorio</Label>\n" +
                            "                <Select value={selectedAccessory} onValueChange={setSelectedAccessory}>\n" +
                            "                  <SelectTrigger>\n" +
                            "                    <SelectValue placeholder=\"Elige un accesorio...\" />\n" +
                            "                  </SelectTrigger>\n" +
                            "                  <SelectContent>\n" +
                            "                    {ACCESSORIES.map((accessory) => (\n" +
                            "                      <SelectItem key={accessory.name} value={accessory.name}>\n" +
                            "                        {accessory.name}\n" +
                            "                      </SelectItem>\n" +
                            "                    ))}\n" +
                            "                  </SelectContent>\n" +
                            "                </Select>\n" +
                            "              </div>\n" +
                            "              <Button\n" +
                            "                onClick={handlePurchase}\n" +
                            "                disabled={loading || !canPurchase}\n" +
                            "                variant=\"outline\"\n" +
                            "                className=\"w-full mt-auto bg-transparent\"\n" +
                            "                title={\n" +
                            "                  user?.accessoryPurchased\n" +
                            "                    ? \"Ya compraste un accesorio\"\n" +
                            "                    : !allStatsMaxed\n" +
                            "                      ? \"Para comprar, necesitas dar tu 300% en el gym!\"\n" +
                            "                      : \"\"\n" +
                            "                }\n" +
                            "              >\n" +
                            "                <ShoppingBag className=\"h-4 w-4 mr-2\" />\n" +
                            "                {user?.accessoryPurchased ? \"Ya compraste\" : \"Comprar\"}\n" +
                            "              </Button>\n" +
                            "              {!allStatsMaxed && !user?.accessoryPurchased && (\n" +
                            "                <p className=\"text-xs text-muted-foreground text-center\">\n" +
                            "                  Para comprar, necesitas dar tu 300% en el gym!\n" +
                            "                </p>\n" +
                            "              )}\n" +
                            "            </>\n" +
                            "          )}\n" +
                            "        </CardContent>\n" +
                            "      </Card>\n" +
                            "    </div>\n" +
                            "  )\n" +
                            "}\ng?height=120&width=120"
                      }}
                  />
                  <p className="mt-4 text-lg font-semibold text-center text-primary">{tempAccessory.name}</p>
                </div>
            ) : (
                <>
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
                      disabled={loading || !canPurchase}
                      variant="outline"
                      className="w-full mt-auto bg-transparent"
                      title={
                        user?.accessoryPurchased
                            ? "Ya compraste un accesorio"
                            : !allStatsMaxed
                                ? "Para comprar, necesitas dar tu 300% en el gym!"
                                : ""
                      }
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {user?.accessoryPurchased ? "Ya compraste" : "Comprar"}
                  </Button>
                  {!allStatsMaxed && !user?.accessoryPurchased && (
                      <p className="text-xs text-muted-foreground text-center">
                        Para comprar, necesitas dar tu 300% en el gym!
                      </p>
                  )}
                </>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
