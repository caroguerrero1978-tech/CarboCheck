# 📱 CarboCheck

CarboCheck es una aplicación multiplataforma diseñada para personas con diabetes tipo 1 y tipo 2.
Su objetivo principal es escanear alimentos a través de la cámara del celular, identificar la cantidad de carbohidratos y azúcares que contienen, y recomendar la medicación adecuada según el tipo de diabetes del usuario.

🔹 Disponible en Android, iOS y versión Web (Chrome y Safari).
🔹 Pensada para ser minimalista, intuitiva y altamente funcional.
🔹 El código fuente está alojado en este repositorio:
 👉 github.com/caroguerrero1978-tech/CarboCheck

## 🚀 Funcionalidades principales

📷 **Escaneo de alimentos con la cámara**: análisis en tiempo real de carbohidratos, azúcares e índice glucémico.

📊 **Base de datos nutricional**: amplia tabla con información detallada de alimentos y productos procesados.

💉 **Recomendaciones personalizadas**:
- Diabetes tipo 1 → cálculo de dosis de insulina.
- Diabetes tipo 2 → recordatorio de medicación (ej: metformina).

📝 **Registro y seguimiento**:
- Ingesta diaria de alimentos.
- Medicación administrada.
- Reportes básicos y avanzados (mensuales, trimestrales, anuales).

🔗 Integración con dispositivos médicos (similar a FEMMTO).
📑 Escaneo de análisis clínicos: desde papel, PDF o imágenes.
🌎 Estadísticas globales y por país.

## ✅ Versión mínima funcional (MVP)

La primera entrega incluirá:
- Registro de usuarios con autenticación segura (Google, Apple, correo + contraseña).
- Pantallas iniciales con diseño minimalista.
- Registro básico de comidas y medicación.
- Escaneo simple de alimentos para devolver carbohidratos y azúcares.
- Página de administrador protegida con contraseña segura.

## 🛠️ Tecnologías y stack

- **Frontend**: React Native (Android & iOS) + React (Web).
- **Backend**: Java Spring Boot.
- **Base de datos**: PostgreSQL.
- **Autenticación**: Firebase Auth / OAuth2.
- **Servicios externos**: integración con APIs nutricionales y de visión por IA.
- **Infraestructura**: AWS (EC2, RDS, S3, Amplify).

## 📂 Estructura del proyecto

```
CarboCheck/
│── frontend/        # App móvil y web (React Native + React)
│── backend/         # API en Java Spring Boot
│── database/        # Modelos y migraciones de PostgreSQL
│── docs/            # Documentación y mockups
│── tests/           # Pruebas unitarias y de integración
│── README.md        # Este archivo
```

## 🔒 Acceso

🌐 **Acceso usuario (web)**:
 👉 https://carbocheck.app (link de despliegue pendiente)

🔐 **Acceso administrador (web)**:
 👉 https://carbocheck.app/admin (con contraseña segura provista al administrador)

### 🖥️ Acceso Local (Testing)
- **Usuario**: `file:///Users/carolinaguerrero/CarboCheck/web/index.html`
- **Admin**: `file:///Users/carolinaguerrero/CarboCheck/web/admin.html`
- **Contraseña Admin**: `CarboCheck2025!`

## 📣 Slogan

✨ "Escanea, analiza y gestiona tu ingesta de carbohidratos fácilmente." ✨

## 📌 Roadmap

- ✅ Definición del MVP.
- 🚧 Desarrollo del frontend y backend inicial.
- 🚀 Publicación de la versión mínima funcional.
- 🔄 Iteraciones con funcionalidades avanzadas (IA, integración con dispositivos médicos, reportes detallados).

## 🤝 Contribuciones

Este proyecto es open a sponsors y colaboradores.
Si querés contribuir, por favor enviá un PR o contactanos.

**Repositorio oficial**:
 👉 https://github.com/caroguerrero1978-tech/CarboCheck
