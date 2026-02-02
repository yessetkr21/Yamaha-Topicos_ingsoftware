# 🏍️ Base de Datos de Imágenes - Yamaha del Sur

## 📋 Instrucciones de Uso

### Paso 1: Extraer las imágenes de la web

1. Abre el navegador y ve a: **https://yamahadelsur.com/**

2. Abre la consola de desarrollador:
   - **Windows/Linux**: Presiona `F12` o `Ctrl + Shift + I`
   - **Mac**: Presiona `Cmd + Option + I`

3. Ve a la pestaña **Console** (Consola)

4. Abre el archivo `extraer-imagenes.js` y copia TODO su contenido

5. Pega el código en la consola y presiona Enter

6. Automáticamente se descargará un archivo llamado `imagenes-yamahadelsur.json`

### Paso 2: Visualizar las imágenes

1. Abre el archivo `visualizador-imagenes.html` en tu navegador
   - Haz doble clic en el archivo
   - O arrastra el archivo a una ventana del navegador

2. Arrastra el archivo JSON descargado (`imagenes-yamahadelsur.json`) a la zona de carga

3. ¡Listo! Verás todas las imágenes organizadas en una interfaz moderna

## 🎯 Características del Visualizador

### 📊 Estadísticas
- Total de imágenes encontradas
- Desglose por tipo (IMG tags, backgrounds, etc.)

### 🔍 Filtros
- **Búsqueda**: Busca por URL o descripción
- **Filtro por tipo**: Filtra por tipo de imagen (IMG, Background, etc.)

### 🖼️ Para cada imagen puedes:
- ✅ **Ver**: Abre la imagen en tamaño completo
- ✅ **Copiar URL**: Copia la URL al portapapeles
- ✅ **Descargar**: Descarga la imagen individualmente

### 📥 Exportaciones
- **Exportar CSV**: Genera una tabla con toda la información
- **Descargar Todas**: Descarga todas las imágenes de una vez

## 📁 Archivos Incluidos

1. **extraer-imagenes.js** - Script para ejecutar en la consola del navegador
2. **visualizador-imagenes.html** - Interfaz web para visualizar las imágenes
3. **INSTRUCCIONES.md** - Este archivo con las instrucciones

## 💡 Notas

- El script detecta:
  - Etiquetas `<img>`
  - Atributos `srcset`
  - Background images en CSS
  - Elementos `<picture>` y `<source>`
  - Lazy loading (`data-src`, `data-background`)

- La interfaz es completamente responsive y funciona en móviles

- No se envía ninguna información a servidores externos, todo funciona localmente

## 🆘 Solución de Problemas

**Si no se encuentran imágenes:**
- Asegúrate de esperar a que la página cargue completamente
- Intenta hacer scroll por toda la página antes de ejecutar el script
- Algunas imágenes pueden cargarse con lazy loading

**Si no se puede descargar una imagen:**
- Puede que la imagen esté protegida por CORS
- La URL puede estar rota o protegida

## 🎨 Personalización

Puedes editar el archivo HTML para:
- Cambiar los colores del tema
- Ajustar el tamaño de las tarjetas
- Modificar los filtros disponibles
