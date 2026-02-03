from django.contrib import admin
from .models import Moto


@admin.register(Moto)
class MotoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']
    search_fields = ['nombre']
