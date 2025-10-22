"use client"

import useSWR from "swr"
import { userAPI, exerciseAPI, routineAPI, adminAPI } from "@/lib/api"
import { CACHE_TIMES } from "@/lib/swr-config"

// Tipos
interface User {
    id: number
    name: string
    username: string
    role: string
    strength: number
    endurance: number
    flexibility: number
    accessoryPurchased: boolean
    accessoryName?: string
}

interface Exercise {
    id: number
    name: string
    description: string
    category: string
    enduranceImpact: number
    strengthImpact: number
    flexibilityImpact: number
}

interface Routine {
    id: number
    name: string
    exercises: Exercise[]
}

// Hook para obtener datos del usuario con caché
export function useUser(userId: number | null) {
    const { data, error, isLoading, mutate } = useSWR(
        userId ? `/api/users/${userId}` : null,
        async () => {
            if (!userId) return null
            const response = await userAPI.getUser(userId)
            return response.data as User
        },
        {
            refreshInterval: CACHE_TIMES.USER,
            revalidateOnFocus: true,
            dedupingInterval: 2000,
        },
    )

    return {
        user: data,
        isLoading,
        isError: error,
        mutate, // Función para actualizar manualmente el caché
        refresh: () => mutate(), // Alias para revalidar
    }
}

// Hook para obtener lista de ejercicios con caché
export function useExercises() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/exercises",
        async () => {
            const response = await exerciseAPI.list()
            return response.data as Exercise[]
        },
        {
            refreshInterval: CACHE_TIMES.EXERCISES,
            revalidateOnFocus: false, // No revalidar al enfocar (datos estables)
            dedupingInterval: 5000,
        },
    )

    return {
        exercises: data || [],
        isLoading,
        isError: error,
        mutate,
        refresh: () => mutate(),
    }
}

// Hook para obtener rutinas del usuario con caché
export function useRoutines() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/routines",
        async () => {
            const response = await routineAPI.list()
            return response.data as Routine[]
        },
        {
            refreshInterval: CACHE_TIMES.ROUTINES,
            revalidateOnFocus: true,
            dedupingInterval: 2000,
        },
    )

    return {
        routines: data || [],
        isLoading,
        isError: error,
        mutate,
        refresh: () => mutate(),
    }
}

// Hook para obtener lista de usuarios (admin) con caché
export function useAdminUsers() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/admin/users",
        async () => {
            const response = await adminAPI.listUsers()
            return response.data as User[]
        },
        {
            refreshInterval: CACHE_TIMES.ADMIN_USERS,
            revalidateOnFocus: true,
            dedupingInterval: 3000,
        },
    )

    return {
        users: data || [],
        isLoading,
        isError: error,
        mutate,
        refresh: () => mutate(),
    }
}

// Hook combinado para obtener ejercicios y rutinas juntos
export function useExercisesAndRoutines() {
    const { exercises, isLoading: exercisesLoading, isError: exercisesError, mutate: mutateExercises } = useExercises()
    const { routines, isLoading: routinesLoading, isError: routinesError, mutate: mutateRoutines } = useRoutines()

    return {
        exercises,
        routines,
        isLoading: exercisesLoading || routinesLoading,
        isError: exercisesError || routinesError,
        refresh: () => {
            mutateExercises()
            mutateRoutines()
        },
    }
}
