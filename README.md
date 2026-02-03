# 🏍️ Yamaha Motos - Catálogo Web

Sitio web de catálogo de motos Yamaha desarrollado con Django, usando arquitectura SOLID y diseño moderno con Tailwind CSS.

![Django](https://img.shields.io/badge/Django-6.0-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Python](https://img.shields.io/badge/Python-3.12-blue)

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación Rápida](#-instalación-rápida-con-docker)
- [Uso de la Aplicación](#-uso-de-la-aplicación)
- [Gestión de Contenido](#-gestión-de-contenido)
- [Solución de Problemas](#-solución-de-problemas)
- [Arquitectura](#-arquitectura)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### **Docker Desktop** (Requerido)

1. **Descargar Docker Desktop**:
   - Windows: https://www.docker.com/products/docker-desktop
   - Instalar y abrir Docker Desktop
   - Esperar a que Docker esté corriendo (ícono verde)

![Docker Desktop](https://img.shields.io/badge/Docker%20Desktop-Requerido-blue?style=for-the-badge)

**Nota**: NO necesitas instalar Python, Django ni otras dependencias. Docker lo hace todo por ti.

---

## 🚀 Instalación Rápida con Docker

### **Paso 1: Obtener el Proyecto**

Descarga o clona este proyecto en tu computadora.

```bash
# Si tienes Git instalado:
git clone <url-del-repositorio>
cd motos-yamaha
```

O simplemente descarga el ZIP y descomprímelo.

---

### **Paso 2: Construir la Imagen** (Solo la primera vez)

Haz **doble click** en el archivo:

```
BUILD.bat
```

**¿Qué hace este archivo?**
- Construye la imagen Docker con Django y todas las dependencias
- Solo necesitas hacerlo una vez (o cuando actualices el código)
- Tomará 2-5 minutos la primera vez

**Espera hasta ver:**
```
========================================
  Imagen construida exitosamente!
========================================
```

---

### **Paso 3: Iniciar la Aplicación**

Haz **doble click** en el archivo:

```
START.bat
```

**¿Qué hace este archivo?**
- Inicia el contenedor Docker en segundo plano
- Levanta el servidor Django en el puerto 8000
- Aplica migraciones de base de datos automáticamente

**Espera unos segundos y verás:**
```
========================================
  Aplicacion iniciada!
========================================

Accede a: http://localhost:8000
```

---

### **Paso 4: Abrir en el Navegador**

Abre tu navegador favorito y ve a:

```
http://localhost:8000
```

¡Listo! Deberías ver la página de inicio de Yamaha Motos 🏍️

---

## 🎮 Uso de la Aplicación

### **Archivos de Control (.bat)**

| Archivo | Función | Cuándo usarlo |
|---------|---------|---------------|
| `BUILD.bat` | Construye la imagen Docker | Solo la primera vez o después de cambios en código |
| `START.bat` | Inicia la aplicación | Cada vez que quieras usar la app |
| `STOP.bat` | Detiene la aplicación | Cuando termines de usar la app |
| `LOGS.bat` | Ver logs en tiempo real | Para debugging o ver qué está pasando |

---

### **Páginas Disponibles**

| URL | Descripción |
|-----|-------------|
| http://localhost:8000 | **Página de inicio** con banner y motos destacadas |
| http://localhost:8000/motos/ | **Catálogo completo** de motos con filtros |
| http://localhost:8000/motos/1/ | **Detalle de moto** individual |
| http://localhost:8000/admin | **Panel de administración** (requiere login) |

---

### **Detener la Aplicación**

Cuando termines de trabajar, haz **doble click** en:

```
STOP.bat
```

Esto detendrá el contenedor Docker y liberará el puerto 8000.

---

## 📊 Gestión de Contenido

### **Acceder al Panel de Administración**

1. **Crear un superusuario** (solo la primera vez):

   Abre una terminal (CMD o PowerShell) en la carpeta del proyecto y ejecuta:

   ```bash
   docker exec yamaha-motos-web python manage.py createsuperuser
   ```

   Te pedirá:
   - **Usuario**: (ej: admin)
   - **Email**: (ej: admin@yamaha.com)
   - **Contraseña**: (mínimo 8 caracteres)

2. **Acceder al admin**:
   - Ve a: http://localhost:8000/admin
   - Ingresa con el usuario y contraseña que creaste

---

### **Agregar Motos al Catálogo**

1. Entra al admin: http://localhost:8000/admin
2. Click en **"Motos"**
3. Click en **"Agregar Moto +"**
4. Completa los campos:
   - **Nombre**: Ej: "YZF-R1"
   - **Categoría**: Sport, Naked, Adventure, etc.
   - **Precio**: Ej: 17999.00
   - **Cilindrada**: Ej: 998
   - **Descripción**: Información de la moto
   - **Imagen**: Sube la foto de la moto
   - **Disponible**: ✅ (marcado)
5. Click en **"Guardar"**

---

### **Subir Imágenes de Motos**

Las imágenes se guardan automáticamente en la carpeta:
```
media/motos/
```

Puedes:
- Subirlas desde el admin (recomendado)
- O copiarlas manualmente a esa carpeta

**Nota**: Las imágenes deben ser JPG o PNG. Recomendado: 800x600px

---

## 🛠️ Solución de Problemas

### **El puerto 8000 ya está en uso**

**Error:**
```
Error: port is already allocated
```

**Solución:**
```bash
# Detener todos los contenedores
docker-compose down

# O matar el proceso en el puerto 8000
netstat -ano | findstr :8000
taskkill /PID <número> /F
```

---

### **Docker Desktop no está corriendo**

**Error:**
```
Error: Cannot connect to the Docker daemon
```

**Solución:**
1. Abre Docker Desktop
2. Espera a que el ícono se ponga verde
3. Intenta de nuevo con `START.bat`

---

### **La página no carga**

**Solución:**
1. Verifica que el contenedor esté corriendo:
   ```bash
   docker ps
   ```
   Deberías ver `yamaha-motos-web`

2. Ver los logs para ver errores:
   ```bash
   docker logs yamaha-motos-web
   ```
   O ejecuta `LOGS.bat`

---

### **Reconstruir desde cero**

Si algo sale mal, reconstruye todo:

```bash
# Detener y eliminar todo
docker-compose down -v

# Reconstruir
docker-compose build --no-cache

# Iniciar de nuevo
docker-compose up -d
```

O simplemente ejecuta `BUILD.bat` de nuevo.

---

## 🏗️ Arquitectura

### **Tecnologías Utilizadas**

- **Backend**: Django 6.0 (Python 3.12)
- **Frontend**: HTML + Tailwind CSS
- **Base de Datos**: SQLite (local)
- **Contenedores**: Docker + Docker Compose
- **Servidor**: Django Development Server

### **Principios SOLID**

El código sigue los principios SOLID:
- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Extensible sin modificar código existente
- **L**iskov Substitution: Las clases derivadas son sustituibles
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependencias invertidas

### **Estructura del Proyecto**

```
motos-yamaha/
├── motos/
│   ├── models.py          # Modelos de datos (Moto)
│   ├── views.py           # Vistas (CBV - Class Based Views)
│   ├── services.py        # Lógica de negocio (Service Layer)
│   └── admin.py           # Configuración del admin
├── templates/
│   ├── base.html          # Template base
│   └── motos/
│       ├── home.html      # Página de inicio
│       ├── lista.html     # Catálogo
│       └── detalle.html   # Detalle de moto
├── static/
│   └── images/
│       └── banner.jpg     # Banner principal
├── media/                 # Imágenes de motos (subidas)
├── yamaha_shop/
│   ├── settings.py        # Configuración Django
│   └── urls.py            # URLs del proyecto
├── Dockerfile             # Configuración Docker
├── docker-compose.yml     # Orquestación
├── BUILD.bat              # Script para construir
├── START.bat              # Script para iniciar
└── STOP.bat               # Script para detener
```

---

## 📝 Comandos Útiles

### **Ver contenedores corriendo**
```bash
docker ps
```

### **Ver logs en tiempo real**
```bash
docker logs -f yamaha-motos-web
```
O ejecuta `LOGS.bat`

### **Entrar al contenedor**
```bash
docker exec -it yamaha-motos-web bash
```

### **Ejecutar comandos Django**
```bash
# Crear migraciones
docker exec yamaha-motos-web python manage.py makemigrations

# Aplicar migraciones
docker exec yamaha-motos-web python manage.py migrate

# Crear superusuario
docker exec yamaha-motos-web python manage.py createsuperuser

# Shell de Django
docker exec -it yamaha-motos-web python manage.py shell
```

---

## 🤝 Para tu Amigo

Si tu amigo quiere replicar este proyecto:

1. **Comparte la carpeta completa** del proyecto
2. **Asegúrate de que tenga Docker Desktop instalado**
3. **Dile que ejecute**:
   - `BUILD.bat` (primera vez)
   - `START.bat` (para iniciar)
4. **Listo!** Ya puede ver la app en http://localhost:8000

**No necesita instalar nada más.** Docker se encarga de todo.

---

## 📧 Soporte

Si tienes problemas:

1. Revisa la sección de [Solución de Problemas](#-solución-de-problemas)
2. Ejecuta `LOGS.bat` para ver errores
3. Verifica que Docker Desktop esté corriendo

---

## 📄 Licencia

Este proyecto es de código abierto.

---

<div align="center">

**Hecho con ❤️ usando Django + Docker**

🏍️ **Yamaha Motos** 🏍️

</div>
