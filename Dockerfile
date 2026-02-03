FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Instalar Django y Pillow
RUN pip install --no-cache-dir Django Pillow

# Copiar proyecto
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
