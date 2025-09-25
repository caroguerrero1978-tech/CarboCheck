# CarboCheck MVP - Funcionalidades Mínimas

## ✅ Funcionalidades Implementadas

### Backend (Java Spring Boot)
- ✅ API REST básica
- ✅ Modelo de datos (Usuario, Alimento, Registro de comidas)
- ✅ Endpoint para escaneo de alimentos
- ✅ Base de datos PostgreSQL configurada
- ✅ Controlador de alimentos con búsqueda

### Frontend (React Native)
- ✅ Navegación básica entre pantallas
- ✅ Pantalla principal con botones de acción
- ✅ Pantalla de escaneo con cámara
- ✅ Integración con API del backend
- ✅ Análisis básico de imágenes (simulado)

### Base de Datos
- ✅ Esquema de tablas principales
- ✅ Datos de prueba insertados
- ✅ Configuración de usuario y permisos

## 🚧 Próximas Funcionalidades

### Fase 2
- [ ] Autenticación de usuarios (Firebase/OAuth2)
- [ ] Integración real con API de visión por IA
- [ ] Cálculo de dosis de insulina para Tipo 1
- [ ] Recordatorios de medicación para Tipo 2
- [ ] Historial de comidas y medicación

### Fase 3
- [ ] Reportes mensuales/trimestrales
- [ ] Integración con dispositivos médicos
- [ ] Panel de administrador
- [ ] Versión web completa
- [ ] Estadísticas globales

## 🔧 Instrucciones de Instalación

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Base de Datos
```bash
psql -U postgres -f database/init.sql
```

## 📱 Uso de la Aplicación

1. **Pantalla Principal**: Acceso a funciones principales
2. **Escanear Alimento**: Tomar foto y obtener análisis nutricional
3. **Ver Resultados**: Carbohidratos, azúcares y recomendaciones

## 🎯 Objetivos del MVP

- Demostrar la funcionalidad core de escaneo
- Validar la arquitectura técnica
- Obtener feedback inicial de usuarios
- Preparar base para funcionalidades avanzadas
