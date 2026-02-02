const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cache de imágenes
let cachedImages = null;
let lastFetch = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// Función para extraer imágenes con Puppeteer
async function extraerImagenes(url) {
    console.log('🚀 Iniciando scraping de:', url);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    try {
        const page = await browser.newPage();

        // Configurar viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Configurar user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log('⏳ Cargando página...');
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log('📜 Haciendo scroll automático...');

        // Scroll automático para activar lazy loading
        await autoScroll(page);

        // Esperar un poco más para que carguen las imágenes
        await page.waitForTimeout(3000);

        console.log('🔍 Extrayendo imágenes...');

        // Extraer todas las imágenes
        const imagenes = await page.evaluate(() => {
            const imagenesSet = new Set();
            const imageData = [];

            function agregarImagen(url, alt, tipo, width, height, clase) {
                // Ignorar URLs vacías, muy pequeñas y placeholders
                if (!url || url.length < 10 || url.includes('data:image/gif;base64,R0lGOD')) {
                    return;
                }

                // Ignorar SVGs inline muy pequeños
                if (url.startsWith('data:image/svg') && url.length < 200) {
                    return;
                }

                // Convertir URLs relativas a absolutas
                try {
                    url = new URL(url, window.location.href).href;
                } catch (e) {
                    return;
                }

                if (!imagenesSet.has(url)) {
                    imagenesSet.add(url);
                    imageData.push({
                        url,
                        alt: alt || 'Sin descripción',
                        tipo,
                        width: width || 'auto',
                        height: height || 'auto',
                        clase: clase || ''
                    });
                }
            }

            // 1. Buscar todas las etiquetas <img>
            document.querySelectorAll('img').forEach(img => {
                if (img.src && !img.src.includes('data:image/svg')) {
                    agregarImagen(
                        img.src,
                        img.alt,
                        'IMG tag',
                        img.naturalWidth || img.width,
                        img.naturalHeight || img.height,
                        img.className
                    );
                }

                // srcset
                if (img.srcset) {
                    img.srcset.split(',').forEach(srcItem => {
                        const url = srcItem.trim().split(' ')[0];
                        agregarImagen(url, img.alt, 'IMG srcset', img.naturalWidth, img.naturalHeight, img.className);
                    });
                }

                // Atributos data-*
                ['data-src', 'data-lazy-src', 'data-original', 'data-srcset', 'data-image'].forEach(attr => {
                    const value = img.getAttribute(attr);
                    if (value) {
                        agregarImagen(value, img.alt, `Data attribute (${attr})`, 'auto', 'auto', img.className);
                    }
                });
            });

            // 2. Background images
            document.querySelectorAll('*').forEach(element => {
                const style = window.getComputedStyle(element);
                const bgImage = style.backgroundImage;

                if (bgImage && bgImage !== 'none') {
                    const matches = bgImage.matchAll(/url\(['"]?([^'")\s]+)['"]?\)/g);
                    for (const match of matches) {
                        agregarImagen(
                            match[1],
                            element.getAttribute('aria-label') || element.getAttribute('title') || 'Background image',
                            'Background CSS',
                            element.offsetWidth,
                            element.offsetHeight,
                            element.className
                        );
                    }
                }
            });

            // 3. Picture y Source
            document.querySelectorAll('picture source, source').forEach(source => {
                if (source.src) {
                    agregarImagen(source.src, 'Picture/Source', 'Picture/Source', 'auto', 'auto', source.className);
                }
                if (source.srcset) {
                    source.srcset.split(',').forEach(srcItem => {
                        const url = srcItem.trim().split(' ')[0];
                        agregarImagen(url, 'Picture/Source srcset', 'Picture/Source', 'auto', 'auto', source.className);
                    });
                }
            });

            // 4. Atributos data-* en general
            const atributosImagen = [
                'data-bg', 'data-background', 'data-image',
                'data-lazy', 'data-bg-url', 'data-background-image'
            ];

            atributosImagen.forEach(attr => {
                document.querySelectorAll(`[${attr}]`).forEach(element => {
                    const value = element.getAttribute(attr);
                    if (value) {
                        agregarImagen(value, element.getAttribute('alt') || `Data: ${attr}`, 'Data attribute', 'auto', 'auto', element.className);
                    }
                });
            });

            return imageData;
        });

        console.log(`✅ Se encontraron ${imagenes.length} imágenes`);

        // Agrupar por tipo
        const porTipo = imagenes.reduce((acc, img) => {
            acc[img.tipo] = (acc[img.tipo] || 0) + 1;
            return acc;
        }, {});

        console.log('📊 Desglose por tipo:', porTipo);

        return imagenes;

    } catch (error) {
        console.error('❌ Error durante el scraping:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Función de scroll automático
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    // Volver arriba
                    window.scrollTo(0, 0);
                    resolve();
                }
            }, 300);
        });
    });
}

// Rutas de la API

// GET /api/imagenes - Obtener todas las imágenes
app.get('/api/imagenes', async (req, res) => {
    try {
        // Verificar cache
        const ahora = Date.now();
        if (cachedImages && lastFetch && (ahora - lastFetch) < CACHE_DURATION) {
            console.log('📦 Sirviendo desde cache');
            return res.json({
                success: true,
                cached: true,
                total: cachedImages.length,
                data: cachedImages
            });
        }

        // Extraer nuevas imágenes
        const imagenes = await extraerImagenes('https://yamahadelsur.com/');

        // Guardar en cache
        cachedImages = imagenes;
        lastFetch = ahora;

        res.json({
            success: true,
            cached: false,
            total: imagenes.length,
            data: imagenes
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/imagenes/refresh - Forzar actualización
app.get('/api/imagenes/refresh', async (req, res) => {
    try {
        console.log('🔄 Forzando actualización...');
        const imagenes = await extraerImagenes('https://yamahadelsur.com/');

        cachedImages = imagenes;
        lastFetch = Date.now();

        res.json({
            success: true,
            total: imagenes.length,
            data: imagenes
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/stats - Estadísticas
app.get('/api/stats', (req, res) => {
    if (!cachedImages) {
        return res.json({
            success: false,
            message: 'No hay datos disponibles. Llama primero a /api/imagenes'
        });
    }

    const stats = {
        total: cachedImages.length,
        porTipo: cachedImages.reduce((acc, img) => {
            acc[img.tipo] = (acc[img.tipo] || 0) + 1;
            return acc;
        }, {}),
        lastUpdate: new Date(lastFetch).toISOString()
    };

    res.json({
        success: true,
        data: stats
    });
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🏍️  Yamaha Image Scraper - Servidor Iniciado        ║
║                                                        ║
║   🌐 URL: http://localhost:${PORT}                        ║
║                                                        ║
║   📡 API Endpoints:                                    ║
║   - GET  /api/imagenes         (Obtener imágenes)     ║
║   - GET  /api/imagenes/refresh (Forzar actualización) ║
║   - GET  /api/stats            (Estadísticas)         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});
