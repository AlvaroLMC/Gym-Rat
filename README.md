# gym-rat

Proyecto Spring Boot minimal para gestionar usuarios de gimnasio.

Características principales:
- Registrar usuarios.
- Entrenar (aumenta `strength`, `endurance` o `flexibility` hasta 100).
- Descansar (reduce las tres estadísticas).
- Comprar **1 accesorio** si el usuario tiene las tres estadísticas a 100 y no ha comprado ya uno.

Endpoints (puerto 8080):
- POST /api/users  { "name": "Alice" }
- GET  /api/users/{id}
- POST /api/users/{id}/train?stat=strength&amount=10
- POST /api/users/{id}/rest?amount=5
- POST /api/users/{id}/purchase?accessoryName=Smart+Watch

H2 consola: http://localhost:8080/h2-console (jdbc url ya configurada)

Generé este proyecto y lo comprimí en `gym-rat.zip`.

Additional features added:
- Authentication using HTTP Basic (users stored in DB with BCrypt password).
- Entities: Exercise, Routine, TrainingSession (history), Role (USER/ADMIN).
- Endpoints to manage exercises, routines and view training history.
- Dockerfile + docker-compose.yml to build and run the app.
- Basic unit tests (JUnit 5) included.

Public registration endpoint: POST /api/public/register {name, username, password}
