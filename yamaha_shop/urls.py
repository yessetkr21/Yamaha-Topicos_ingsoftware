from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from motos.views import home_view, MotoListView, MotoDetailView

urlpatterns = [
    path('', home_view, name='home'),
    path('motos/', MotoListView.as_view(), name='moto-lista'),
    path('motos/<int:pk>/', MotoDetailView.as_view(), name='moto-detail'),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
