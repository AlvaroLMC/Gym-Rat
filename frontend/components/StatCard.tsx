import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300 animate-pulse-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-4xl font-bold mt-2">{value}</p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${Math.min(value, 100)}%` }}
              />
            </div>
          </div>
          <div className={`${color} p-4 rounded-2xl`}>
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
