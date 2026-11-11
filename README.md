# Transmisiones en vivo (EnVivo)

Sistema para gestionar transmisiones en vivo: inventario de kits de grabacion, usuarios y equipos de
trabajo, calendario y programacion de transmisiones, cobertura, tarifas y pagos.

## Requisitos
- Node.js 20 o superior
- PostgreSQL

## 1. Backend
    cd backend
    npm install
    cp .env.example .env      # luego editar .env con tu clave de PostgreSQL (el archivo debe llamarse .env)
    npx prisma migrate dev    # crea las tablas (la primera vez te pide un nombre, ej: cobertura)
    npm run dev               # http://localhost:3000

Al iniciar por primera vez se crean 4 usuarios de ejemplo (si la tabla esta vacia).

Datos de ejemplo de cobertura, tarifas y pagos (ejecutar una sola vez cada uno):

    npm run seed:cobertura
    npm run seed:tarifas
    npm run seed:pagos

## 2. Frontend (otra terminal)
    cd frontend
    npm install
    npm run dev               # http://localhost:5173

## Usuarios de ejemplo
| Correo | Clave | Rol |
|---|---|---|
| admin@envivo.com | admin123 | admin |
| carlos@envivo.com | carlos123 | operador |
| maria@envivo.com | maria123 | operador |
| pedro@envivo.com | pedro123 | operador |

## Permisos por rol
| Seccion | admin | coordinador | operador |
|---|:-:|:-:|:-:|
| Inicio, Calendario, Cobertura en vivo | si | si | si |
| Panel general, Programar transmision, Clientes y precios, Pagos | si | si | no |
| Usuarios y equipos, Inventario de kits | si | no | no |

Toda la API (salvo el login) exige sesion. Los permisos se validan en el backend con el middleware
`backend/src/middlewares/auth.middleware.js`; el frontend solo oculta lo que no corresponde.

## Correo al crear un equipo
Al crear un equipo con integrantes, cada uno recibe un correo avisandole que fue seleccionado.
Se configura con las variables MAIL_* del `.env` (ver `.env.example`). Si MAIL_HOST esta vacio la app
funciona igual pero no envia correos.

## Estructura
- `backend/prisma/schema.prisma`: modelos (usuarios, equipos, kits, transmisiones, tarifas, pagos...)
- `backend/src/routes`: rutas de la API (`/api/auth`, `/api/admin`, `/api/transmisiones`, `/api/cobertura`, `/api/tarifas`, `/api/pagos`)
- `frontend/src/components/Sidebar.jsx`: menu lateral (cada opcion define que roles la ven)
- `frontend/src/styles/Cobertura.css`: estilos de las pantallas de cobertura (aislados con `.zona-cobertura`)
