import type { SWRConfiguration } from "swr"

// Configuración global de SWR para el sistema de caché
export const swrConfig: SWRConfiguration = {
    // Revalidar cuando la ventana recupera el foco
    revalidateOnFocus: true,

    // Revalidar cuando se reconecta la red
    revalidateOnReconnect: true,

    // Reintentar en caso de error
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,

    // Mantener datos previos mientras se revalida
    keepPreviousData: true,

    // Deduplicar peticiones en un intervalo de 2 segundos
    dedupingInterval: 2000,

    // Configuración de caché
    provider: () => new Map(),

    // Función para manejar errores globalmente
    onError: (error, key) => {
        console.error("[Cache] Error fetching:", key, error)
    },

    // Función para manejar éxito globalmente
    onSuccess: (data, key) => {
        console.log("[Cache] Successfully fetched:", key)
    },
}

// Tiempos de revalidación para diferentes tipos de datos
export const CACHE_TIMES = {
    USER: 30000, // 30 segundos - datos del usuario cambian frecuentemente
    EXERCISES: 300000, // 5 minutos - ejercicios cambian raramente
    ROUTINES: 60000, // 1 minuto - rutinas cambian con cierta frecuencia
    ADMIN_USERS: 120000, // 2 minutos - usuarios admin cambian ocasionalmente
}
