#!/bin/bash

echo "🏥 Instalando CarboCheck..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear directorio de uploads
mkdir -p uploads

# Verificar MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB no está instalado localmente."
    echo "   Puedes usar MongoDB Atlas o instalar MongoDB localmente."
fi

echo "✅ Instalación completada!"
echo ""
echo "🚀 Para iniciar la aplicación:"
echo "   npm start"
echo ""
echo "🔧 Para desarrollo:"
echo "   npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en: http://localhost:3000"
echo ""
echo "👨‍💼 Acceso de administrador:"
echo "   Contraseña: CarboCheck2025!Admin"
echo "   Acceso directo: Ctrl+Shift+A"
