"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Zap } from "lucide-react"

interface EnergyBarProps {
    currentEnergy: number
    maxEnergy?: number
}

export function EnergyBar({ currentEnergy, maxEnergy = 300 }: EnergyBarProps) {
    const [displayEnergy, setDisplayEnergy] = useState(currentEnergy)

    useEffect(() => {
        // Animación suave al cambiar la energía
        const timer = setTimeout(() => {
            setDisplayEnergy(currentEnergy)
        }, 100)
        return () => clearTimeout(timer)
    }, [currentEnergy])

    const percentage = Math.max(0, Math.min(100, (displayEnergy / maxEnergy) * 100))

    // Color basado en el nivel de energía
    const getEnergyColor = () => {
        if (percentage > 66) return "bg-gradient-to-r from-emerald-400 to-cyan-500"
        if (percentage > 33) return "bg-gradient-to-r from-yellow-400 to-orange-500"
        return "bg-gradient-to-r from-red-500 to-red-600"
    }

    return (
        <Card className="border-2 overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-cyan-500" />
                        <h3 className="text-lg font-semibold">Energía</h3>
                    </div>
                    <span className="text-sm font-mono font-bold">
            {displayEnergy} / {maxEnergy}
          </span>
                </div>

                <div className="relative h-8 bg-muted rounded-full overflow-hidden border-2 border-border">
                    {/* Barra de energía con animación */}
                    <div
                        className={`h-full ${getEnergyColor()} transition-all duration-700 ease-out relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Efecto de brillo animado */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>

                    {/* Texto centrado */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-foreground drop-shadow-lg">{percentage.toFixed(0)}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
