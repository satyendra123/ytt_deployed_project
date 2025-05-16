from django.urls import path
from .views import check_boom,check_vehicle_data

urlpatterns = [
    path('vehicle_data_1/', check_vehicle_data, name='vehicle_data'),
    path('check_boom_1/', check_boom, name='check_boom'),
]
