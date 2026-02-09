from django.db import models
from django.urls import reverse


class Moto(models.Model):
    """
    Modelo que representa una motocicleta Yamaha.
    Sigue el principio de Single Responsibility: solo maneja datos de motos.
    """
    CATEGORIAS = [
        ('sport', 'Sport'),
        ('touring', 'Touring'),
        ('naked', 'Naked'),
        ('adventure', 'Adventure'),
        ('scooter', 'Scooter'),
    ]

    nombre = models.CharField(
        max_length=200,
        verbose_name="Nombre",
        help_text="Nombre del modelo (ej: YZF-R1)"
    )

    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIAS,
        default='sport',
        verbose_name="Categoría"
    )

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Precio",
        help_text="Precio en USD"
    )

    cilindrada = models.IntegerField(
        verbose_name="Cilindrada (cc)",
        help_text="Capacidad del motor en centímetros cúbicos"
    )

    descripcion = models.TextField(
        verbose_name="Descripción",
        blank=True,
        help_text="Descripción detallada de la moto"
    )

    imagen = models.ImageField(
        upload_to='motos/',
        verbose_name="Imagen",
        blank=True,
        null=True
    )

    disponible = models.BooleanField(
        default=True,
        verbose_name="Disponible"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Moto"
        verbose_name_plural = "Motos"
        ordering = ['categoria', 'nombre']
        indexes = [
            models.Index(fields=['categoria']),
            models.Index(fields=['disponible']),
        ]

    def __str__(self):
        return f"{self.nombre} - {self.get_categoria_display()}"

    def get_absolute_url(self):
        """URL canónica para el detalle de la moto"""
        return reverse('moto-detail', kwargs={'pk': self.pk})

    @property
    def precio_formateado(self):
        """Retorna el precio formateado en pesos colombianos (COP)"""
        # Formato colombiano: puntos como separadores de miles, sin decimales
        precio_str = f"{int(self.precio):,}".replace(',', '.')
        return f"${precio_str}"
