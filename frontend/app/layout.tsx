import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Gym Rat - Tu Compañero de Entrenamiento",
  description: "Aplicación de gestión de entrenamiento y fitness",
  generator: "v0.app",
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased relative`}>
      <div
          className="fixed inset-0 -z-10 opacity-[0.15]"
          style={{
            backgroundImage: "url(/gym-pattern-bg.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "400px 400px",
          }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </Suspense>
      <Analytics />
      </body>
      </html>
  )
}
