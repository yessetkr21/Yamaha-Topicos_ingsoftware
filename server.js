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

        console.log('🔍 Extrayendo imágenes y productos...');

        // Extraer todas las imágenes y datos de productos
        const imagenes = await page.evaluate(() => {
            const imagenesSet = new Set();
            const imageData = [];

            function esImagenMoto(url, alt, width, height, clase) {
                // Ignorar URLs vacías, data URIs y muy pequeñas
                if (!url || url.length < 10 || url.startsWith('data:')) {
                    return false;
                }

                const urlLower = url.toLowerCase();
                const altLower = (alt || '').toLowerCase();
                const claseLower = (clase || '').toLowerCase();

                // FILTRAR BASURA - Rechazar logos, íconos, banners
                const basuraPatterns = [
                    'logo', 'icon', 'banner', 'header', 'footer', 'menu',
                    'button', 'arrow', 'social', 'whatsapp', 'facebook',
                    'instagram', 'youtube', 'email', 'phone', 'favicon',
                    'sprite', 'thumbnail-small', 'avatar', 'badge'
                ];

                if (basuraPatterns.some(pattern =>
                    urlLower.includes(pattern) ||
                    altLower.includes(pattern) ||
                    claseLower.includes(pattern)
                )) {
                    return false;
                }

                // Rechazar imágenes muy pequeñas (logos e íconos suelen ser pequeños)
                if (width && height) {
                    const w = parseInt(width);
                    const h = parseInt(height);
                    // Las motos suelen ser imágenes de al menos 300x300
                    if (w < 300 || h < 300) {
                        return false;
                    }
                }

                // ACEPTAR MOTOS - Buscar palabras clave relacionadas con motos
                const motoKeywords = [
                    'yamaha', 'moto', 'motorcycle', 'bike', 'scooter',
                    'nmax', 'mt', 'r15', 'fz', 'xtz', 'yzf', 'tenere',
                    'fazer', 'crypton', 'xsr', 'tracer', 'aerox'
                ];

                const tienePalabraMoto = motoKeywords.some(keyword =>
                    urlLower.includes(keyword) ||
                    altLower.includes(keyword) ||
                    claseLower.includes(keyword)
                );

                // Si tiene palabra clave de moto, aceptar
                if (tienePalabraMoto) {
                    return true;
                }

                // Si la imagen es grande (probablemente producto) y no es basura, aceptar
                if (width && height) {
                    const w = parseInt(width);
                    const h = parseInt(height);
                    if (w >= 500 && h >= 400) {
                        return true;
                    }
                }

                return false;
            }

            function agregarImagen(url, alt, tipo, width, height, clase) {
                // Convertir URLs relativas a absolutas
                try {
                    url = new URL(url, window.location.href).href;
                } catch (e) {
                    return;
                }

                // Filtrar solo imágenes de motos
                if (!esImagenMoto(url, alt, width, height, clase)) {
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

            // Extraer información de productos/motos
            const productos = [];

            // Buscar cards de productos, secciones de motos, etc.
            document.querySelectorAll('article, .product, .motorcycle, [class*="card"], [class*="product"], [class*="bike"]').forEach(element => {
                const titulo = element.querySelector('h1, h2, h3, h4, .title, [class*="title"], [class*="name"]')?.textContent?.trim();
                const descripcion = element.querySelector('p, .description, [class*="description"], [class*="desc"]')?.textContent?.trim();
                const precio = element.querySelector('.price, [class*="price"], [class*="cost"]')?.textContent?.trim();
                const imagen = element.querySelector('img')?.src;

                if (titulo || descripcion || imagen) {
                    productos.push({
                        titulo: titulo || 'Sin título',
                        descripcion: descripcion || 'Sin descripción',
                        precio: precio || null,
                        imagen: imagen ? new URL(imagen, window.location.href).href : null
                    });
                }
            });

            // También buscar en cualquier elemento con texto que parezca nombre de moto
            const textos = Array.from(document.querySelectorAll('h1, h2, h3, h4, strong, b')).map(el => ({
                texto: el.textContent.trim(),
                imagen: el.closest('div, article, section')?.querySelector('img')?.src
            })).filter(item => item.texto && item.texto.length > 3 && item.texto.length < 100);

            return { imageData, productos, textos };
        });

        const { imageData, productos, textos } = imagenes;

        console.log(`✅ Se encontraron ${imageData.length} imágenes`);
        console.log(`📦 Se encontraron ${productos.length} productos`);
        console.log(`📝 Se encontraron ${textos.length} textos relevantes`);

        // Agrupar por tipo
        const porTipo = imagenes.reduce((acc, img) => {
            acc[img.tipo] = (acc[img.tipo] || 0) + 1;
            return acc;
        }, {});

        console.log('📊 Desglose por tipo:', porTipo);

        return {
            imagenes: imageData,
            productos,
            textos,
            total: imageData.length
        };

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
                total: cachedImages.total || cachedImages.imagenes?.length || 0,
                data: cachedImages
            });
        }

        // Extraer nuevas imágenes
        const datos = await extraerImagenes('https://yamahadelsur.com/');

        // Guardar en cache
        cachedImages = datos;
        lastFetch = ahora;

        res.json({
            success: true,
            cached: false,
            total: datos.total,
            data: datos
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
        const datos = await extraerImagenes('https://yamahadelsur.com/');

        cachedImages = datos;
        lastFetch = Date.now();

        res.json({
            success: true,
            total: datos.total,
            data: datos
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

    const imagenes = cachedImages.imagenes || cachedImages;
    const stats = {
        total: Array.isArray(imagenes) ? imagenes.length : cachedImages.total,
        productos: cachedImages.productos?.length || 0,
        porTipo: Array.isArray(imagenes) ? imagenes.reduce((acc, img) => {
            acc[img.tipo] = (acc[img.tipo] || 0) + 1;
            return acc;
        }, {}) : {},
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
