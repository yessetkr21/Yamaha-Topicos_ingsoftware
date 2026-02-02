# 🏍️ Yamaha del Sur - Scraper de Imágenes

Aplicación web con Node.js y Express que extrae y visualiza todas las imágenes de la página de Yamaha del Sur usando Puppeteer.

## 🚀 Características

- ✅ **Scraping automático** con Puppeteer (navegador headless)
- ✅ **Scroll automático** para activar lazy loading
- ✅ **API REST** para consultar las imágenes
- ✅ **Interfaz web moderna** y responsive
- ✅ **Sistema de caché** (30 minutos)
- ✅ **Filtros y búsqueda** en tiempo real
- ✅ **Exportación** a CSV y JSON
- ✅ **Descarga** de imágenes individuales

## 📋 Requisitos

- Node.js (versión 16 o superior)
- npm o yarn

## ⚡ Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará:
- `express` - Framework web
- `puppeteer` - Navegador headless para scraping
- `cors` - Manejo de CORS
- `nodemon` - Auto-reload en desarrollo (opcional)

### 2. Iniciar el servidor

```bash
npm start
```

O en modo desarrollo (con auto-reload):

```bash
npm run dev
```

### 3. Abrir en el navegador

Abre tu navegador y ve a:

```
http://localhost:3000
```

¡Listo! La aplicación automáticamente:
1. Cargará la página de Yamaha del Sur
2. Hará scroll para activar lazy loading
3. Extraerá todas las imágenes
4. Las mostrará en una interfaz moderna

## 🌐 API Endpoints

### GET `/api/imagenes`
Obtiene todas las imágenes (usa caché si está disponible)

**Respuesta:**
```json
{
  "success": true,
  "cached": false,
  "total": 45,
  "data": [
    {
      "url": "https://...",
      "alt": "Descripción",
      "tipo": "IMG tag",
      "width": 1920,
      "height": 1080,
      "clase": "hero-image"
    }
  ]
}
```

### GET `/api/imagenes/refresh`
Fuerza una nueva extracción (ignora caché)

### GET `/api/stats`
Obtiene estadísticas de las imágenes en caché

## 🎨 Interfaz Web

La interfaz incluye:

- **Estadísticas** - Total de imágenes, por tipo, estado del caché
- **Filtros** - Buscar por URL/descripción, filtrar por tipo
- **Galería** - Grid responsive con todas las imágenes
- **Acciones por imagen**:
  - 👁️ Ver en tamaño completo (modal)
  - 📋 Copiar URL al portapapeles
  - ⬇️ Descargar imagen
- **Exportación**:
  - 📊 CSV - Para análisis en Excel
  - 💾 JSON - Para uso en otras aplicaciones
- **Refrescar** - Forzar nueva extracción

## 🔧 Configuración

### Cambiar el puerto

Edita `server.js`:

```javascript
const PORT = 3000; // Cambia a tu puerto preferido
```

### Ajustar el caché

Edita `server.js`:

```javascript
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos
```

### Cambiar la URL objetivo

Edita `server.js`:

```javascript
const imagenes = await extraerImagenes('https://tu-url-aqui.com/');
```

## 📁 Estructura del Proyecto

```
motos-yamaha/
├── server.js           # Servidor Express + lógica de scraping
├── package.json        # Dependencias y scripts
├── public/
│   └── index.html     # Interfaz web
└── README.md          # Este archivo
```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'puppeteer'"

```bash
npm install
```

### El servidor no inicia

Verifica que el puerto 3000 no esté en uso:

```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### No se encuentran imágenes

1. Verifica tu conexión a internet
2. La página puede estar bloqueando scrapers
3. Intenta ejecutar con:

```javascript
headless: false // en server.js para ver el navegador
```

### Puppeteer no se instala en Windows

Instala las dependencias de build tools:

```bash
npm install --global windows-build-tools
```

## 🔒 Consideraciones Legales

Este scraper es para uso educativo y personal. Asegúrate de:
- Respetar el archivo `robots.txt` del sitio
- No hacer scraping masivo que sobrecargue el servidor
- Respetar los términos de servicio del sitio web
- Usar las imágenes conforme a sus licencias

## 📝 Notas Técnicas

- **Puppeteer** usa Chromium para renderizar JavaScript
- El **scroll automático** espera 300ms entre cada paso
- Las **imágenes duplicadas** se filtran automáticamente
- El **caché** se invalida después de 30 minutos
- Compatible con **Windows**, **Linux** y **macOS**

## 🤝 Contribuciones

Siéntete libre de mejorar este proyecto:
- Añadir más filtros
- Mejorar la UI
- Optimizar el scraping
- Añadir soporte para más sitios

---

**Desarrollado con ❤️ usando Node.js, Express y Puppeteer**
