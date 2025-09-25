# CarboCheck

**Escanea, analiza y gestiona tu ingesta de carbohidratos fácilmente**

Una aplicación web para personas con diabetes que permite monitorear la ingesta de carbohidratos a través del análisis de imágenes de alimentos.

## Características Principales

- 📱 **Análisis de imágenes en tiempo real**: Escanea alimentos y obtén información nutricional instantánea
- 📊 **Base de datos nutricional amplia**: Información detallada de carbohidratos, azúcares e índice glucémico
- 💊 **Recomendaciones personalizadas**: Sugerencias de insulina y medicación según el tipo de diabetes
- 📋 **Registro y seguimiento**: Historial completo de consumo diario
- 📈 **Reportes detallados**: Análisis mensual de tu ingesta de carbohidratos

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/caroguerrero1978-tech/carbocheck.git
cd carbocheck
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
- Instalar MongoDB localmente o usar MongoDB Atlas
- Configurar la URL de conexión en el archivo `.env`

4. **Iniciar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

5. **Acceder a la aplicación**
- Abrir navegador en `http://localhost:3000`

## Uso

### Para Usuarios

1. **Registro**: Crear cuenta con información personal y tipo de diabetes
2. **Escanear**: Tomar foto de alimentos para análisis nutricional
3. **Registrar**: Guardar consumo con recomendaciones personalizadas
4. **Monitorear**: Revisar historial y reportes mensuales

### Para Administradores

- **Acceso**: Usar Ctrl+Shift+A o ir a `/admin`
- **Contraseña**: `CarboCheck2025!Admin`
- **Funciones**: Ver estadísticas, gestionar usuarios, agregar alimentos

## Estructura del Proyecto

```
carbocheck/
├── models/           # Modelos de base de datos
├── routes/           # Rutas de la API
├── public/           # Archivos estáticos (HTML, CSS, JS)
├── uploads/          # Imágenes subidas
├── server.js         # Servidor principal
├── package.json      # Dependencias
└── README.md         # Este archivo
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Usuarios
- `GET /api/users/profile` - Perfil del usuario
- `GET /api/users/consumption-history` - Historial de consumo
- `GET /api/users/monthly-report` - Reporte mensual

### Alimentos
- `POST /api/foods/analyze-image` - Análisis de imagen
- `POST /api/foods/consume` - Registrar consumo
- `GET /api/foods/search` - Buscar alimentos

### Administración
- `POST /api/admin/dashboard` - Dashboard de admin
- `POST /api/admin/add-food` - Agregar alimento
- `POST /api/admin/users` - Listar usuarios

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Autenticación**: JWT, bcryptjs
- **Subida de archivos**: Multer

## Configuración de Entorno

Crear archivo `.env` con:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/carbocheck
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
```

## Próximas Funcionalidades

- [ ] Integración con servicios de IA para análisis de imágenes real
- [ ] Aplicación móvil nativa (React Native)
- [ ] Integración con dispositivos médicos
- [ ] Múltiples idiomas
- [ ] Sincronización con Google Health / Apple Health

## Contribuir

1. Fork el proyecto
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

- **Desarrollador**: Carolina Guerrero
- **GitHub**: [@caroguerrero1978-tech](https://github.com/caroguerrero1978-tech)

---

**CarboCheck** - Empoderando a las personas con diabetes para gestionar su dieta y salud de manera proactiva.
