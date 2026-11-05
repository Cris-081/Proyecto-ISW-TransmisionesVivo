# Transmisiones en vivo (Req. 1 y Req. 2)

## 1. Base de datos
Crear en PostgreSQL una base vacía:  `CREATE DATABASE transmisiones;`

## 2. Backend
    cd backend
    # editar .env y poner la contraseña real de PostgreSQL
    npm install
    npm run dev          # http://localhost:3000

## 3. Frontend (otra terminal)
    cd frontend
    npm install
    npm run dev          # http://localhost:5173

## Endpoints
- GET  /api/transmisiones/disponibilidad?fecha=YYYY-MM-DD   (Req. 1)
- POST /api/transmisiones  {tema, fecha, horaInicio, horaFin} (Req. 1)
- GET  /api/transmisiones?anio=YYYY&mes=M                   (Req. 2)
