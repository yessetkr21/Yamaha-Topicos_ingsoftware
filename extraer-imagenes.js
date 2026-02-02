// Script MEJORADO para ejecutar en la consola del navegador en https://yamahadelsur.com/
// Copia y pega este código en la consola (F12 -> Console)

(async function() {
    console.log('🚀 Iniciando extracción de imágenes...');
    console.log('⏳ Paso 1: Haciendo scroll automático para activar lazy loading...');

    // Función para hacer scroll y esperar
    async function scrollCompleto() {
        const scrollStep = 500;
        const scrollDelay = 300;

        let lastHeight = document.body.scrollHeight;
        let currentPosition = 0;

        while (currentPosition < lastHeight) {
            window.scrollTo(0, currentPosition);
            await new Promise(resolve => setTimeout(resolve, scrollDelay));
            currentPosition += scrollStep;

            // Recalcular altura por si se cargó contenido nuevo
            lastHeight = document.body.scrollHeight;
        }

        // Scroll al final
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Volver arriba
        window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Hacer scroll completo primero
    await scrollCompleto();

    console.log('✅ Paso 2: Extrayendo imágenes...');

    const imagenes = new Set();
    const imageData = [];

    function agregarImagen(url, alt, tipo, width, height, clase, elemento) {
        // Ignorar URLs vacías, data URIs muy pequeñas y placeholders
        if (!url || url.length < 10 || url.includes('data:image/gif;base64,R0lGOD') || url.includes('placeholder')) {
            return;
        }

        // Convertir URLs relativas a absolutas
        try {
            url = new URL(url, window.location.href).href;
        } catch (e) {
            return;
        }

        if (!imagenes.has(url)) {
            imagenes.add(url);
            imageData.push({
                url: url,
                alt: alt || 'Sin descripción',
                tipo: tipo,
                width: width || 'auto',
                height: height || 'auto',
                clase: clase || '',
                elemento: elemento || ''
            });
        }
    }

    // 1. Buscar todas las etiquetas <img>
    console.log('🔍 Buscando etiquetas <img>...');
    document.querySelectorAll('img').forEach(img => {
        if (img.src && !img.src.includes('data:image/svg')) {
            agregarImagen(
                img.src,
                img.alt,
                'IMG tag',
                img.naturalWidth || img.width,
                img.naturalHeight || img.height,
                img.className,
                'img'
            );
        }

        // Verificar srcset
        if (img.srcset) {
            img.srcset.split(',').forEach(srcItem => {
                const parts = srcItem.trim().split(' ');
                const url = parts[0];
                agregarImagen(url, img.alt, 'IMG srcset', img.naturalWidth, img.naturalHeight, img.className, 'img[srcset]');
            });
        }

        // Verificar data-src y variaciones
        ['data-src', 'data-lazy-src', 'data-original', 'data-srcset'].forEach(attr => {
            const value = img.getAttribute(attr);
            if (value) {
                agregarImagen(value, img.alt, 'Data attribute (img)', 'auto', 'auto', img.className, `img[${attr}]`);
            }
        });
    });

    // 2. Buscar background-image en elementos
    console.log('🔍 Buscando background images...');
    document.querySelectorAll('*').forEach(element => {
        const style = window.getComputedStyle(element);
        const bgImage = style.backgroundImage;

        if (bgImage && bgImage !== 'none') {
            const matches = bgImage.matchAll(/url\(['"]?([^'")\s]+)['"]?\)/g);
            for (const match of matches) {
                const url = match[1];
                agregarImagen(
                    url,
                    element.getAttribute('aria-label') || element.getAttribute('title') || 'Background image',
                    'Background CSS',
                    element.offsetWidth,
                    element.offsetHeight,
                    element.className,
                    element.tagName.toLowerCase()
                );
            }
        }

        // Buscar en style inline
        const inlineStyle = element.getAttribute('style');
        if (inlineStyle && inlineStyle.includes('background')) {
            const matches = inlineStyle.matchAll(/url\(['"]?([^'")\s]+)['"]?\)/g);
            for (const match of matches) {
                agregarImagen(match[1], 'Inline style background', 'Inline CSS', element.offsetWidth, element.offsetHeight, element.className, element.tagName.toLowerCase());
            }
        }
    });

    // 3. Buscar en elementos <picture> y <source>
    console.log('🔍 Buscando elementos <picture> y <source>...');
    document.querySelectorAll('picture source, source').forEach(source => {
        if (source.src) {
            agregarImagen(source.src, 'Picture/Source', 'Picture/Source', 'auto', 'auto', source.className, 'source[src]');
        }
        if (source.srcset) {
            source.srcset.split(',').forEach(srcItem => {
                const url = srcItem.trim().split(' ')[0];
                agregarImagen(url, 'Picture/Source srcset', 'Picture/Source', 'auto', 'auto', source.className, 'source[srcset]');
            });
        }
    });

    // 4. Buscar en todos los atributos que puedan contener URLs de imágenes
    console.log('🔍 Buscando atributos data-* y otros...');
    const atributosImagen = [
        'data-src', 'data-background', 'data-bg', 'data-image',
        'data-lazy', 'data-lazy-src', 'data-original', 'data-srcset',
        'data-bg-url', 'data-background-image', 'data-img', 'data-thumbnail'
    ];

    atributosImagen.forEach(attr => {
        document.querySelectorAll(`[${attr}]`).forEach(element => {
            const value = element.getAttribute(attr);
            if (value) {
                agregarImagen(value, element.getAttribute('alt') || element.getAttribute('title') || `Data attribute: ${attr}`, 'Data attribute', 'auto', 'auto', element.className, `[${attr}]`);
            }
        });
    });

    // 5. Buscar en hojas de estilo CSS
    console.log('🔍 Buscando en hojas de estilo CSS...');
    try {
        Array.from(document.styleSheets).forEach(sheet => {
            try {
                Array.from(sheet.cssRules || sheet.rules || []).forEach(rule => {
                    if (rule.style && rule.style.backgroundImage) {
                        const matches = rule.style.backgroundImage.matchAll(/url\(['"]?([^'")\s]+)['"]?\)/g);
                        for (const match of matches) {
                            agregarImagen(match[1], `CSS Rule: ${rule.selectorText}`, 'CSS Stylesheet', 'auto', 'auto', '', 'stylesheet');
                        }
                    }
                });
            } catch (e) {
                // CORS puede bloquear hojas de estilo externas
            }
        });
    } catch (e) {
        console.warn('No se pudieron leer algunas hojas de estilo:', e);
    }

    // 6. Buscar URLs de imágenes en el código JavaScript
    console.log('🔍 Buscando URLs en scripts...');
    const scriptContent = Array.from(document.querySelectorAll('script'))
        .map(s => s.textContent)
        .join(' ');

    const urlPatterns = [
        /https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp|svg|bmp)/gi,
        /\/[^\s"']*\.(jpg|jpeg|png|gif|webp|svg|bmp)/gi
    ];

    urlPatterns.forEach(pattern => {
        const matches = scriptContent.matchAll(pattern);
        for (const match of matches) {
            agregarImagen(match[0], 'Encontrada en script', 'JavaScript', 'auto', 'auto', '', 'script');
        }
    });

    console.log(`\n✅ ¡Extracción completada!`);
    console.log(`📊 Total de imágenes encontradas: ${imageData.length}`);
    console.log(`\n📋 Desglose por tipo:`);

    const tipos = {};
    imageData.forEach(img => {
        tipos[img.tipo] = (tipos[img.tipo] || 0) + 1;
    });
    console.table(tipos);

    console.log('\n🖼️ Lista de imágenes:');
    imageData.forEach((img, i) => {
        console.log(`${i + 1}. [${img.tipo}] ${img.alt.substring(0, 50)}... - ${img.url.substring(0, 80)}...`);
    });

    // Crear JSON para descargar
    const jsonData = JSON.stringify(imageData, null, 2);

    // Crear un blob y descargar
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imagenes-yamahadelsur.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('\n📥 Archivo JSON descargado: imagenes-yamahadelsur.json');
    console.log('🎉 ¡Proceso completado! Ahora abre el visualizador HTML y carga el archivo JSON.');

    return imageData;
})();
