#!/bin/bash

echo "🚀 Iniciando CarboCheck localmente..."

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java no encontrado. Instalando..."
    brew install openjdk@17
fi

# Verificar si Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven no encontrado. Instalando..."
    brew install maven
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Instalando..."
    brew install node
fi

# Iniciar backend
echo "🔧 Iniciando backend (Puerto 8080)..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!

# Esperar a que el backend inicie
sleep 10

# Iniciar servidor web simple para frontend
echo "🌐 Iniciando servidor web (Puerto 3000)..."
cd ../web
python3 -m http.server 3000 &
WEB_PID=$!

echo "✅ CarboCheck ejecutándose localmente:"
echo "🌐 Frontend: http://localhost:3000"
echo "🔐 Admin: http://localhost:3000/admin.html"
echo "🔧 API Backend: http://localhost:8080"

# Abrir en Chrome
open -a "Google Chrome" http://localhost:3000
open -a "Google Chrome" http://localhost:3000/admin.html

echo "📝 PIDs guardados:"
echo "Backend PID: $BACKEND_PID"
echo "Web PID: $WEB_PID"

# Guardar PIDs para poder detener después
echo $BACKEND_PID > backend.pid
echo $WEB_PID > web.pid

echo "⚠️  Para detener los servicios ejecuta: ./stop-local.sh"
