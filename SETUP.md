# 🏍️ Configuración del Proyecto Yamaha Motos

## 📦 Instalación para colaboradores

Si eres un colaborador del proyecto y acabas de clonar el repositorio, sigue estos pasos:

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/yessetkr21/Yamaha-Topicos_ingsoftware.git
cd Yamaha-Topicos_ingsoftware
```

### 2️⃣ Ejecutar migraciones (crear la base de datos)
```bash
python manage.py migrate
```

### 3️⃣ Cargar los datos iniciales (motos con precios)
```bash
python manage.py loaddata fixtures/initial_data.json
```

### 4️⃣ Crear un superusuario (opcional, para acceder al admin)
```bash
python manage.py createsuperuser
```

### 5️⃣ Ejecutar el servidor
```bash
python manage.py runserver
```

## 🐳 Con Docker

Si prefieres usar Docker:

```bash
# Construir la imagen
docker-compose build

# Ejecutar migraciones
docker-compose run web python manage.py migrate

# Cargar datos iniciales
docker-compose run web python manage.py loaddata fixtures/initial_data.json

# Iniciar el servidor
docker-compose up
```

## 📸 Sobre las imágenes

Las imágenes de las motos están en la carpeta `imagenes-moto/`. Actualmente el campo `imagen` en la base de datos está vacío. Para asignar imágenes a las motos:

1. Accede al admin de Django: `http://localhost:8000/admin`
2. Ve a la sección "Motos"
3. Edita cada moto y sube su imagen correspondiente

O copia las imágenes a la carpeta `media/motos/` si quieres hacerlo manualmente.

## ❓ Problemas comunes

### No veo los precios ni las motos
→ Ejecuta el paso 3: `python manage.py loaddata fixtures/initial_data.json`

### No puedo acceder al admin
→ Crea un superusuario con: `python manage.py createsuperuser`

### Las imágenes no se muestran
→ Las imágenes deben estar en `media/motos/` y configuradas en el admin de Django
