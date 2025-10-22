# 🏋️ GymRat - Sistema de Gestión de Entrenamiento

GymRat es una aplicación full-stack para la gestión de entrenamientos personalizados, rutinas y ejercicios. Permite a los usuarios entrenar diferentes estadísticas (fuerza, resistencia, flexibilidad), crear rutinas personalizadas y comprar accesorios para mejorar su experiencia de entrenamiento.

## 🚀 Tecnologías

### Backend
- **Spring Boot** - Framework principal
- **PostgreSQL** - Base de datos
- **H2 Database** - Base de datos en memoria para tests
- **Spring Security + JWT** - Autenticación y autorización
- **Log4j2** - Sistema de logging avanzado
- **MockMvc** - Tests de integración
- **Hibernate/JPA** - ORM para persistencia

### Frontend
- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos y diseño
- **SWR** - Sistema de caché y gestión de estado
- **Axios** - Cliente HTTP
- **shadcn/ui** - Componentes UI

## ✨ Características Principales

### Para Usuarios
- 🔐 Sistema de autenticación con JWT
- 💪 Entrenamiento de estadísticas (Fuerza, Resistencia, Flexibilidad)
- 📋 Creación y gestión de rutinas personalizadas
- 🏃 Biblioteca de ejercicios con impactos en estadísticas
- 🛍️ Compra de accesorios
- 📊 Dashboard con visualización de progreso
- ⚠️ Alertas de sobreentrenamiento

### Para Administradores
- 👥 Gestión completa de usuarios
- 🔑 Cambio de roles y reseteo de contraseñas
- 📝 CRUD completo de ejercicios
- 📈 Auditoría de acciones con Log4j2

### Características Técnicas
- ⚡ Sistema de caché con SWR para optimización de rendimiento
- 🔄 Revalidación automática de datos
- 🧪 Suite completa de tests de integración
- 📝 Logging estructurado con Log4j2
- 🔒 Seguridad con Spring Security y JWT
- 🎨 Diseño responsive y moderno


## 🔌 API Endpoints

### Autenticación
- POST   /api/auth/login          # Iniciar sesión
- POST   /api/auth/register       # Registrar usuario

### Usuarios
- GET    /api/users/id          # Obtener datos del usuario
- POST   /api/users/id/train    # Entrenar estadística
- POST   /api/users/id/rest     # Descansar
- POST   /api/users/id/purchase # Comprar accesorio
    
### Ejercicios
- GET    /api/exercises           # Listar ejercicios
- POST   /api/exercises           # Crear ejercicio
- PUT    /api/exercises/id      # Actualizar ejercicio
- DELETE /api/exercises/id      # Eliminar ejercicio

### Rutinas
- GET    /api/routines            # Listar rutinas del usuario
- POST   /api/routines            # Crear rutina
- PUT    /api/routines/id       # Actualizar rutina
- DELETE /api/routines/id       # Eliminar rutina


### Administración (Requiere rol ADMIN)
- GET    /api/admin/users                # Listar todos los usuarios
- POST   /api/admin/users                # Crear usuario
- PUT    /api/admin/users/id           # Actualizar usuario
- DELETE /api/admin/users/id           # Eliminar usuario
- PUT    /api/admin/users/id/role      # Cambiar rol
- PUT    /api/admin/users/id/password  # Resetear contraseña



## 🛠️ Configuración y Ejecución

### Requisitos Previos
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Backend

****Ejecutar el backend**

    ' cd backend
    ' mvn clean install
    ' mvn spring-boot:run

El backend estará disponible en `http://localhost:8080`

### Frontend

****Instalar dependencias****

    ' cd frontend
    ' npm install

****Ejecutar el frontend****
    
    ' npm run dev

El frontend estará disponible en `http://localhost:3000`


## 🧪 Tests
****Ejecutar Tests de Integración****

    ' cd backend
    ' mvn test

### Tests Implementados

- **AdminControllerIntegrationTest** - Tests de gestión de usuarios
- **GymControllerIntegrationTest** - Tests de entrenamiento y compras
- **RoutineControllerIntegrationTest** - Tests de rutinas
- **ExerciseControllerIntegrationTest** - Tests de CRUD de ejercicios
- **AuthControllerIntegrationTest** - Tests de autenticación y registro


Los tests utilizan:

- Base de datos H2 en memoria
- `@WithMockUser` para simular autenticación
- `@Transactional` para rollback automático


## Sistema de Caché

El frontend implementa un sistema de caché con SWR para optimizar el rendimiento:

### Hooks de Caché Disponibles

- Caché de datos de usuario

        const { data: user, error, isLoading, mutate } = useUserCache(userId);

  - Caché de ejercicios

        const { data: exercises, error, isLoading, mutate } = useExercisesCache();

    - Caché de rutinas

          const { data: routines, error, isLoading, mutate } = useRoutinesCache();

### Características del Caché

- ⚡ Revalidación automática cada 30 segundos
- 🔄 Revalidación al recuperar el foco de la ventana
- 🔁 Reintentos automáticos en caso de error
- 📦 Deduplicación de peticiones


## Sistema de Logging

El backend utiliza Log4j2 con configuración avanzada:

### Niveles de Log

- **AUDIT** - Acciones críticas de usuarios (login, cambios de rol, etc.)
- **ERROR** - Errores de aplicación
- **WARN** - Advertencias
- **INFO** - Información general
- **DEBUG** - Información de depuración


## Seguridad

- Autenticación basada en JWT
- Contraseñas encriptadas con BCrypt
- Roles de usuario (USER, ADMIN)
- Protección CSRF deshabilitada para API REST
- Validación de tokens en cada petición
- `@Transactional` para prevenir lazy loading exceptions


## Roles y Permisos

### USER

- Acceso a dashboard personal
- Gestión de rutinas propias
- Entrenamiento y compra de accesorios
- Visualización de ejercicios


### ADMIN

- Todos los permisos de USER
- Gestión completa de usuarios
- CRUD de ejercicios
- Cambio de roles y contraseñas


## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Autor

Desarrollado para aprobar la tarea 2 del sprint 5 del bootcamp de Java & Spring Framework de la ItAcademy.








