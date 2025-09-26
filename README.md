Productos App (backend + frontend)

Backend:
  - carpeta: backend
  - puerto: 4000
  - endpoints:
    GET /api/productos   -> lista productos
    POST /api/productos  -> agrega producto (body JSON: { nombre, precio })
    DELETE /api/productos/:id -> elimina por id

  Instalar y ejecutar:
    cd backend
    npm install
    npm start

Frontend (Vite + React):
  - carpeta: frontend
  - puerto dev: 5173 (vite)
  - usa Tailwind CDN (no requiere build de Tailwind)
  - variables: VITE_API_URL para apuntar al backend si necesitas cambiar

  Instalar y ejecutar:
    cd frontend
    npm install
    npm run dev

Nota: productos se guardan en backend/productos.json
