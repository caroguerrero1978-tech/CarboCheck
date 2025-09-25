#!/bin/bash

echo "🛑 Deteniendo CarboCheck..."

# Detener backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    kill $BACKEND_PID 2>/dev/null
    rm backend.pid
    echo "✅ Backend detenido"
fi

# Detener servidor web
if [ -f web.pid ]; then
    WEB_PID=$(cat web.pid)
    kill $WEB_PID 2>/dev/null
    rm web.pid
    echo "✅ Servidor web detenido"
fi

# Matar procesos por puerto como backup
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "🏁 CarboCheck detenido completamente"
