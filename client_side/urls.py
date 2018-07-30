from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('places/', views.places, name='places'),
    path('latlong/', views.latlong, name='latlong'),
    path('currentloc/', views.currentloc, name='currentloc'),
]
