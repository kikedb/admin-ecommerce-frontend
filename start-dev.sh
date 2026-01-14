#!/bin/bash

# Script de inicio unificado para Admin E-commerce
# URLs fijas:
# - Backend: http://localhost:8000
# - Frontend: http://localhost:5173
# - Acceso: http://localhost:5173 (frontend se conecta automáticamente al backend)

echo "🚀 Iniciando Admin E-commerce..."
echo ""
echo "📦 Backend API: http://localhost:8000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "⚠️  Presiona Ctrl+C para detener ambos servidores"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend
cd /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-backend
php -d extension_dir=/dev/null artisan serve --host=127.0.0.1 --port=8000 > /tmp/laravel-backend.log 2>&1 &
BACKEND_PID=$!

# Esperar 2 segundos para que el backend inicie
sleep 2

# Verificar que el backend esté funcionando
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend iniciado correctamente"
else
    echo "❌ Error al iniciar el backend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Iniciar frontend
cd /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servicios iniciados"
echo ""
echo "👉 Accede a la aplicación en: http://localhost:5173"
echo ""

# Mantener el script corriendo
wait
