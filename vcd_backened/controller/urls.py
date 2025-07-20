from django.urls import path
from .views import check_vehicle_data, check_boomsig

urlpatterns = [
    path('vehicle_data', check_vehicle_data, name='vehicle_data'),
    path('check_boomsig', check_boomsig, name='check_boomsig'),
]
