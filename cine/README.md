# Proyecto Cine Armando 

Una aplicación web full-stack para gestionar películas, reseñas y favoritos de usuarios, construida con React, Node.js y MongoDB.

## Características

- Autenticación y autorización de usuarios
- Navegación y búsqueda de películas
- Detalles de películas con integración de TMDB
- Reseñas y valoraciones de usuarios
- Gestión de películas favoritas
- Diseño responsivo con Tailwind CSS

## Requisitos previos

- Docker y Docker Compose
- Node.js 18 o superior (para desarrollo local)
- pnpm (gestor de paquetes)

## Instalación y Configuración

 1. Clona el repositorio:
  git clone <repository-url>
  2.  cd cine
  3. docker compose up --build 


## Variables de entorno
#### frontend (.env): 
PORT=3000
MONGODB_URI=mongodb://root:example@mongo:27017/auth_db?authSource=admin
JWT_SECRET=claveSUPERSECRETA
FRONTEND_URL=http://localhost

TMDB_API_KEY=a33481fb05443bafabda012d518d3c88
TMDB_BASE_URL=https://api.themoviedb.org/3

#### backend (.env):
VITE_API_TOKEN=a33481fb05443bafabda012d518d3c88
VITE_BASE_IMAGE_URL=https://image.tmdb.org/t/p
VITE_BACKEND_URL=http://localhost:3000




### Estrtuctura:  
```bash

cine/
├── frontend/          # Aplicación frontend en React
├── backend/           # Aplicación backend en Node.js
├── docker-compose.yaml # Archivo de composición de Docker
└── README.md         # Documentación del proyecto

frontend/
├── src/
│   ├── components/    # Componentes reutilizables
│   ├── context/      # Context API
│   ├── pages/        # Páginas de la aplicación
│   ├── services/     # Servicios y llamadas API
│   ├── utils/        # Utilidades y helpers
│   ├── App.jsx       # Componente principal
│   └── main.jsx      # Punto de entrada
├── package.json
└── vite.config.js

backend/
├── src/
│   ├── controllers/  # Controladores de la aplicación
│   ├── middleware/   # Middleware personalizado
│   ├── models/       # Modelos de MongoDB
│   ├── routes/       # Rutas de la API
│   ├── config/       # Configuraciones
│   ├── services/     # Servicios externos
│   └── app.js        # Aplicación Express
├── package.json
└── .env.example

🔗 API Endpoints
Autenticación

POST /api/auth/register - Registro de usuarios
POST /api/auth/login - Inicio de sesión
POST /api/auth/logout - Cierre de sesión

Usuarios

GET /api/users/profile - Obtener perfil de usuario
PUT /api/users/profile - Actualizar perfil
DELETE /api/users - Eliminar cuenta

Películas

GET /api/movies - Listar películas
GET /api/movies/:id - Obtener detalles de película
POST /api/movies/favorite - Agregar a favoritos
DELETE /api/movies/favorite/:id - Eliminar de favoritos

🚀 Desarrollo

Frontend: http://localhost:3000
Backend: http://localhost:4000
MongoDB: mongodb://localhost:27017
Mongo Express: http://localhost:8081
