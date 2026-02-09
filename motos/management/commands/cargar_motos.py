"""
Management command para cargar las motos al catalogo
"""
from django.core.management.base import BaseCommand
from django.core.files import File
from motos.models import Moto
import os


class Command(BaseCommand):
    help = 'Carga las motos NMAX, MT09 y Aerox 155 al catalogo'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando carga de motos...'))

        # Datos de las motos
        motos_data = [
            {
                'nombre': 'NMAX 155',
                'categoria': 'scooter',
                'precio': 4500.00,
                'cilindrada': 155,
                'descripcion': 'Elegancia urbana con tecnologia de punta. El scooter perfecto para la ciudad con potente motor de 155cc, diseno aerodinamico y maximo confort.',
                'imagen_path': 'static/images/motos/nmax/negra.avif',
                'specs': {
                    'potencia': '15,15 HP',
                    'torque': '14,2 Nm',
                    'altura': '1200 mm'
                }
            },
            {
                'nombre': 'MT-09 SP',
                'categoria': 'naked',
                'precio': 12500.00,
                'cilindrada': 890,
                'descripcion': 'La bestia naked de Yamaha. Motor de 3 cilindros en linea CP3 de 890cc, chasis de aluminio, suspension KYB y frenos Brembo. Pura adrenalina.',
                'imagen_path': 'static/images/motos/mt09/GRIS.avif',
                'specs': {
                    'potencia': '119 HP',
                    'torque': '93 Nm',
                    'peso': '189 kg'
                }
            },
            {
                'nombre': 'Aerox 155',
                'categoria': 'scooter',
                'precio': 3800.00,
                'cilindrada': 155,
                'descripcion': 'Scooter deportivo con ADN R-Series. Motor VVA 155cc, diseno agresivo inspirado en YZF-R1, y tecnologia LED. Ideal para jovenes urbanos.',
                'imagen_path': 'static/images/motos/aerox155/NEGRA.avif',
                'specs': {
                    'potencia': '15 HP',
                    'torque': '13,9 Nm',
                    'peso': '126 kg'
                }
            }
        ]

        # Crear o actualizar cada moto
        for moto_data in motos_data:
            nombre = moto_data['nombre']

            # Verificar si ya existe
            moto, created = Moto.objects.get_or_create(
                nombre=nombre,
                defaults={
                    'categoria': moto_data['categoria'],
                    'precio': moto_data['precio'],
                    'cilindrada': moto_data['cilindrada'],
                    'descripcion': moto_data['descripcion'],
                    'disponible': True
                }
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'[OK] Moto "{nombre}" creada exitosamente')
                )
            else:
                # Actualizar datos si ya existe
                moto.categoria = moto_data['categoria']
                moto.precio = moto_data['precio']
                moto.cilindrada = moto_data['cilindrada']
                moto.descripcion = moto_data['descripcion']
                moto.disponible = True
                moto.save()
                self.stdout.write(
                    self.style.WARNING(f'[WARN] Moto "{nombre}" ya existia, datos actualizados')
                )

            # Asignar imagen (solo si existe el archivo)
            imagen_path = moto_data['imagen_path']
            if os.path.exists(imagen_path):
                self.stdout.write(f'  [*] Asignando imagen: {imagen_path}')
            else:
                self.stdout.write(
                    self.style.WARNING(f'  [WARN] Imagen no encontrada: {imagen_path}')
                )

        self.stdout.write(
            self.style.SUCCESS('\n[OK] Carga de motos completada!\n')
        )
        self.stdout.write('Puedes verificar las motos en:')
        self.stdout.write('  - Admin: http://localhost:8000/admin/motos/moto/')
        self.stdout.write('  - Catalogo: http://localhost:8000/motos/')
