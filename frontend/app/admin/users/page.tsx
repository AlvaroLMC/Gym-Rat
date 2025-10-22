"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { adminAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Users, UserPlus, Pencil, Trash2, Shield, Key } from "lucide-react"

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

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showRoleDialog, setShowRoleDialog] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        role: "USER",
    })
    const [newRole, setNewRole] = useState("")
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        if (currentUser?.role !== "ADMIN") {
            router.push("/dashboard")
            return
        }
        loadUsers()
    }, [currentUser, router])

    const loadUsers = async () => {
        setLoading(true)
        try {
            console.log("[v0] Fetching users from admin API...")
            const response = await adminAPI.listUsers()
            console.log("[v0] Admin API response:", response)
            console.log("[v0] Response data:", response.data)
            console.log("[v0] Response data type:", typeof response.data)
            console.log("[v0] Is array?", Array.isArray(response.data))

            let usersData = response.data
            if (typeof response.data === "string") {
                console.log("[v0] Response is string, attempting to parse...")
                try {
                    usersData = JSON.parse(response.data)
                } catch (e) {
                    console.error("[v0] Failed to parse response:", e)
                    usersData = []
                }
            }

            if (!Array.isArray(usersData)) {
                console.warn("[v0] Response is not an array, setting empty array")
                usersData = []
            }

            console.log("[v0] Final users data:", usersData)
            setUsers(usersData)
        } catch (error: any) {
            console.error("[v0] Error loading users:", error)
            console.error("[v0] Error response:", error.response)
            console.error("[v0] Error message:", error.message)
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error al cargar usuarios",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = async () => {
        try {
            await adminAPI.createUser(formData)
            toast({
                title: "Usuario creado",
                description: `Usuario ${formData.username} creado exitosamente`,
            })
            setShowCreateDialog(false)
            setFormData({ name: "", username: "", password: "", role: "USER" })
            loadUsers()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error al crear usuario",
                variant: "destructive",
            })
        }
    }

    const handleUpdateUser = async () => {
        if (!selectedUser) return
        try {
            await adminAPI.updateUser(selectedUser.id, {
                name: formData.name,
                username: formData.username,
            })
            toast({
                title: "Usuario actualizado",
                description: "Usuario actualizado exitosamente",
            })
            setShowEditDialog(false)
            setSelectedUser(null)
            loadUsers()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error al actualizar usuario",
                variant: "destructive",
            })
        }
    }

    const handleDeleteUser = async () => {
        if (!selectedUser) return
        try {
            await adminAPI.deleteUser(selectedUser.id)
            toast({
                title: "Usuario eliminado",
                description: "Usuario eliminado exitosamente",
            })
            setShowDeleteDialog(false)
            setSelectedUser(null)
            loadUsers()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error al eliminar usuario",
                variant: "destructive",
            })
        }
    }

    const handleChangeRole = async () => {
        if (!selectedUser) return
        try {
            await adminAPI.changeUserRole(selectedUser.id, newRole)
            toast({
                title: "Rol actualizado",
                description: `Rol cambiado a ${newRole} exitosamente`,
            })
            setShowRoleDialog(false)
            setSelectedUser(null)
            setNewRole("")
            loadUsers()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error al cambiar rol",
                variant: "destructive",
            })
        }
    }

    const handleResetPassword = async () => {
        if (!selectedUser) return
        try {
            await adminAPI.resetUserPassword(selectedUser.id, newPassword)
            toast({
                title: "Contraseña actualizada",
                description: "Contraseña restablecida exitosamente",
            })
            setShowPasswordDialog(false)
            setSelectedUser(null)
            setNewPassword("")
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error al restablecer contraseña",
                variant: "destructive",
            })
        }
    }

    const openEditDialog = (user: User) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            username: user.username,
            password: "",
            role: user.role,
        })
        setShowEditDialog(true)
    }

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user)
        setShowDeleteDialog(true)
    }

    const openRoleDialog = (user: User) => {
        setSelectedUser(user)
        setNewRole(user.role)
        setShowRoleDialog(true)
    }

    const openPasswordDialog = (user: User) => {
        setSelectedUser(user)
        setNewPassword("")
        setShowPasswordDialog(true)
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center">Cargando usuarios...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            Gestión de Usuarios
                        </CardTitle>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Crear Usuario
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estadísticas</TableHead>
                                <TableHead>Accesorio</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>@{user.username}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>Fuerza: {user.strength}</div>
                                            <div>Resistencia: {user.endurance}</div>
                                            <div>Flexibilidad: {user.flexibility}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.accessoryPurchased ? (
                                            <Badge variant="outline">{user.accessoryName || "Sí"}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openRoleDialog(user)}>
                                                <Shield className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openPasswordDialog(user)}>
                                                <Key className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openDeleteDialog(user)}
                                                disabled={user.id === currentUser?.id}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                        <DialogDescription>Ingresa los datos del nuevo usuario</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Rol</Label>
                            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">USER</SelectItem>
                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateUser}>Crear Usuario</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                        <DialogDescription>Modifica los datos del usuario</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Nombre</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-username">Usuario</Label>
                            <Input
                                id="edit-username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdateUser}>Guardar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Usuario</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar al usuario {selectedUser?.username}? Esta acción no se puede
                            deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar Rol</DialogTitle>
                        <DialogDescription>Selecciona el nuevo rol para {selectedUser?.username}</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="new-role">Rol</Label>
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">USER</SelectItem>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleChangeRole}>Cambiar Rol</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Restablecer Contraseña</DialogTitle>
                        <DialogDescription>Ingresa la nueva contraseña para {selectedUser?.username}</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleResetPassword}>Restablecer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
