# 🚀 CÓMO USAR - Guía Rápida

## Para Principiantes (Paso a Paso)

---

## 📦 ANTES DE EMPEZAR

### ¿Qué necesitas?
- ✅ Docker Desktop instalado
- ✅ Esta carpeta del proyecto
- ❌ NO necesitas Python
- ❌ NO necesitas instalar Django

### Descargar Docker Desktop
👉 https://www.docker.com/products/docker-desktop

---

## 🎯 PRIMERA VEZ (3 Pasos)

### **1️⃣ Abrir Docker Desktop**
- Busca "Docker Desktop" en tu computadora
- Ábrelo y espera a que se ponga en verde
- Listo, déjalo abierto

### **2️⃣ Construir el Proyecto**
- Ve a la carpeta del proyecto
- Haz **doble click** en: `BUILD.bat`
- Espera 2-5 minutos
- Verás: "Imagen construida exitosamente!"

### **3️⃣ Iniciar la Aplicación**
- Haz **doble click** en: `START.bat`
- Espera 10 segundos
- Abre tu navegador
- Ve a: **http://localhost:8000**

**¡LISTO! Ya está funcionando 🎉**

---

## 🔄 DESPUÉS DE LA PRIMERA VEZ

Solo necesitas 2 pasos:

### **1. Abrir Docker Desktop**
(Si no está abierto)

### **2. Iniciar la App**
- Doble click en: `START.bat`
- Espera 10 segundos
- Abre: **http://localhost:8000**

---

## ⏹️ DETENER LA APLICACIÓN

Cuando termines:
- Doble click en: `STOP.bat`
- Listo, la app se detiene

---

## 🖼️ AGREGAR MOTOS

### Crear Usuario Admin (Solo una vez)

1. Abre CMD o PowerShell en la carpeta del proyecto
2. Copia y pega esto:
```bash
docker exec yamaha-motos-web python manage.py createsuperuser
```
3. Escribe:
   - Usuario: admin
   - Email: admin@yamaha.com
   - Contraseña: (la que quieras, mínimo 8 caracteres)

### Subir Motos

1. Ve a: **http://localhost:8000/admin**
2. Inicia sesión con tu usuario
3. Click en **"Motos"**
4. Click en **"Agregar Moto +"**
5. Llena los campos:
   - Nombre: YZF-R1
   - Categoría: Sport
   - Precio: 17999
   - Cilindrada: 998
   - Descripción: (lo que quieras)
   - Imagen: (sube la foto)
   - Disponible: ✅
6. Click en **"Guardar"**

---

## 🐛 SI ALGO SALE MAL

### "El puerto 8000 ya está en uso"
```bash
docker-compose down
```
Luego ejecuta `START.bat` de nuevo

### "No puedo conectarme"
1. Verifica que Docker Desktop esté abierto (verde)
2. Ejecuta `LOGS.bat` para ver errores
3. Si nada funciona, ejecuta:
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### "La página no carga"
Espera 30 segundos después de ejecutar `START.bat`.
La primera vez toma más tiempo.

---

## 📂 ARCHIVOS IMPORTANTES

| Archivo | Para qué sirve |
|---------|----------------|
| `BUILD.bat` | Construir el proyecto (primera vez) |
| `START.bat` | Iniciar la app |
| `STOP.bat` | Detener la app |
| `LOGS.bat` | Ver qué está pasando |

---

## ✅ CHECKLIST RÁPIDO

```
☐ Docker Desktop instalado
☐ Docker Desktop abierto (ícono verde)
☐ Ejecutado BUILD.bat (primera vez)
☐ Ejecutado START.bat
☐ Esperado 10-30 segundos
☐ Abierto http://localhost:8000
```

---

## 🎓 PARA TU AMIGO

Si quieres compartir este proyecto:

1. **Compártele toda la carpeta** (por ZIP o Drive)
2. **Dile que instale Docker Desktop**
3. **Que siga esta guía**
4. Listo, le funcionará igual

---

## 📞 PÁGINAS DEL SITIO

| URL | Qué verás |
|-----|-----------|
| http://localhost:8000 | Inicio con banner |
| http://localhost:8000/motos/ | Todas las motos |
| http://localhost:8000/motos/1/ | Detalle de una moto |
| http://localhost:8000/admin | Panel de control |

---

## 💡 TIPS

- **No cierres Docker Desktop** mientras uses la app
- **Usa STOP.bat** antes de apagar la PC
- **Las fotos** se guardan en la carpeta `media/motos/`
- **El admin** es para agregar/editar motos
- **La base de datos** es SQLite (archivo `db.sqlite3`)

---

## ⚡ RESUMEN ULTRA RÁPIDO

```bash
# Primera vez
1. Instalar Docker Desktop
2. Doble click en BUILD.bat
3. Doble click en START.bat
4. Abrir http://localhost:8000

# Después
1. Doble click en START.bat
2. Abrir http://localhost:8000

# Detener
1. Doble click en STOP.bat
```

---

<div align="center">

**¿Dudas? Revisa el README.md completo**

🏍️ **¡Disfruta tu sitio de Yamaha Motos!** 🏍️

</div>
