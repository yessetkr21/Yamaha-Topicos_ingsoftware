"""
Vistas para el módulo de motos.
Usa Class-Based Views siguiendo principios SOLID.
"""
from django.views.generic import ListView, DetailView
from django.shortcuts import render
from .models import Moto
from .services import MotoService


class MotoListView(ListView):
    """
    Vista para listar todas las motos.
    Sigue el principio de Open/Closed: extensible sin modificar.
    """
    model = Moto
    template_name = 'motos/lista.html'
    context_object_name = 'motos'
    paginate_by = 12

    def get_queryset(self):
        """Filtra motos según parámetros de búsqueda"""
        queryset = MotoService.obtener_motos_disponibles()

        # Filtrar por categoría si existe
        categoria = self.request.GET.get('categoria')
        if categoria:
            queryset = MotoService.obtener_motos_por_categoria(categoria)

        # Búsqueda por nombre
        search = self.request.GET.get('q')
        if search:
            queryset = MotoService.buscar_motos(search)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categorias'] = MotoService.obtener_categorias()
        context['categoria_actual'] = self.request.GET.get('categoria', '')
        return context


class MotoDetailView(DetailView):
    """Vista para el detalle de una moto específica"""
    model = Moto
    template_name = 'motos/detalle.html'
    context_object_name = 'moto'

    def get_queryset(self):
        return MotoService.obtener_motos_disponibles()


def home_view(request):
    """Vista de inicio con motos destacadas"""
    motos_destacadas = MotoService.obtener_motos_disponibles()[:6]
    categorias = MotoService.obtener_categorias()

    context = {
        'motos_destacadas': motos_destacadas,
        'categorias': categorias,
    }
    return render(request, 'motos/home.html', context)
