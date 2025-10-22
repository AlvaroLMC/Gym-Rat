"use client"

import type React from "react"

import { SWRConfig } from "swr"
import { swrConfig } from "@/lib/swr-config"

export function Providers({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}
