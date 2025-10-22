"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Dumbbell, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Gym Rat
            </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/exercises" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Ejercicios
              </Link>
              <Link href="/routines" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Rutinas
              </Link>
              {user?.role === "ADMIN" && (
                  <Link
                      href="/admin/users"
                      className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                  >
                    Administración
                  </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-muted-foreground">@{user?.username}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
  )
}
