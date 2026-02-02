# 🔧 Solución de Problemas - No aparecen las motos

## ✅ Script Mejorado

He actualizado el script `extraer-imagenes.js` con las siguientes mejoras:

### Nuevas características:
- ✅ **Scroll automático** para activar lazy loading
- ✅ **Espera inteligente** para que carguen todas las imágenes
- ✅ **Más atributos detectados** (data-src, data-lazy, data-original, etc.)
- ✅ **Busca en CSS** de las hojas de estilo
- ✅ **Busca en JavaScript** incrustado
- ✅ **Convierte URLs relativas** a absolutas
- ✅ **Mejor logging** para ver qué está encontrando

## 🎯 Cómo usar el script mejorado:

### IMPORTANTE: Sigue estos pasos EN ORDEN

1. **Abre la web**: https://yamahadelsur.com/

2. **ESPERA** a que la página cargue completamente (hasta que dejes de ver el spinner de carga)

3. **Haz scroll manualmente** hasta el final de la página para asegurarte de que todo cargó

4. **Abre la consola**:
   - Presiona `F12`
   - Ve a la pestaña **Console**

5. **Copia y pega** el contenido completo de `extraer-imagenes.js`

6. **Presiona Enter** y espera

7. **El script hará**:
   - Scroll automático de arriba a abajo
   - Esperará a que carguen las imágenes
   - Buscará en todos los lugares posibles
   - Te mostrará un resumen en la consola
   - Descargará el archivo JSON automáticamente

## 📊 Verificación

En la consola deberías ver algo como:

```
🚀 Iniciando extracción de imágenes...
⏳ Paso 1: Haciendo scroll automático...
✅ Paso 2: Extrayendo imágenes...
🔍 Buscando etiquetas <img>...
🔍 Buscando background images...
🔍 Buscando elementos <picture>...
✅ ¡Extracción completada!
📊 Total de imágenes encontradas: XX
```

## 🚨 Si aún no aparecen las motos:

### Opción A: Método Manual con Network Tab

1. **Abre DevTools** (F12)
2. **Ve a la pestaña Network**
3. **Filtra por**: `Img` o escribe `jpg, png, webp` en el filtro
4. **Recarga la página** (F5)
5. **Haz scroll** por toda la página
6. **Clic derecho** en la lista de imágenes → "Save all as HAR"

Luego usa este código para extraer las URLs del archivo HAR:

```javascript
// 1. Abre el archivo HAR en un editor
// 2. Ejecuta este código en la consola con el contenido HAR

const harContent = {/* pega aquí el contenido del HAR */};
const imagenes = harContent.log.entries
    .filter(entry => entry.response.content.mimeType?.includes('image'))
    .map(entry => ({
        url: entry.request.url,
        tipo: entry.response.content.mimeType,
        tamaño: entry.response.content.size
    }));

console.table(imagenes);

// Descargar JSON
const blob = new Blob([JSON.stringify(imagenes, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'imagenes-network.json';
a.click();
```

### Opción B: Inspeccionar elemento directamente

1. **Clic derecho** sobre una imagen de moto que SÍ veas en la web
2. **Selecciona "Inspeccionar"**
3. **Mira** en el HTML cuál es el atributo que usa:
   - ¿Es `src`?
   - ¿Es `data-src`?
   - ¿Es background-image?
   - ¿Es otro atributo?

4. **Dime cuál es** y actualizaré el script específicamente para esa web

### Opción C: Captura de pantalla

Si nada funciona:
1. **Abre DevTools** (F12)
2. **Ve a Network** → **Img**
3. **Haz scroll** por la página
4. **Captura de pantalla** de la pestaña Network mostrando las imágenes
5. **Envíame** la captura y te ayudo a crear un script personalizado

## 💡 Posibles causas

La web puede estar usando:
- **CDN con protección**: Las URLs pueden tener tokens temporales
- **Framework moderno**: React/Next.js que carga imágenes de forma especial
- **Lazy loading avanzado**: Intersection Observer que carga solo lo visible
- **Imágenes dinámicas**: Generadas por JavaScript después de interacción del usuario

## 🆘 ¿Necesitas ayuda?

Dime qué ves en la consola cuando ejecutas el script y te ayudo a diagnosticar el problema específico.
