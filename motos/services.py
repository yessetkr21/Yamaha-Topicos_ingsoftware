"""
Servicios para el módulo de motos.
Sigue el principio de Single Responsibility y Dependency Inversion.
"""
from typing import List, Optional
from django.db.models import QuerySet
from .models import Moto


class MotoService:
    """
    Servicio para operaciones relacionadas con motos.
    Centraliza la lógica de negocio (Business Logic Layer).
    """

    @staticmethod
    def obtener_motos_disponibles() -> QuerySet[Moto]:
        """Obtiene todas las motos disponibles"""
        return Moto.objects.filter(disponible=True)

    @staticmethod
    def obtener_motos_por_categoria(categoria: str) -> QuerySet[Moto]:
        """Obtiene motos filtradas por categoría"""
        return Moto.objects.filter(
            categoria=categoria,
            disponible=True
        )

    @staticmethod
    def obtener_categorias() -> List[tuple]:
        """Retorna las categorías disponibles"""
        return Moto.CATEGORIAS

    @staticmethod
    def buscar_motos(query: str) -> QuerySet[Moto]:
        """Busca motos por nombre o descripción"""
        return Moto.objects.filter(
            nombre__icontains=query,
            disponible=True
        )
