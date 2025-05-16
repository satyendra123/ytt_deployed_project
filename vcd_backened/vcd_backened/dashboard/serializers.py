from rest_framework import serializers
from .models import CarLog,Boomsig,BarrierOpenLog

class CarLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarLog
        fields = '__all__'  # Include all fields from the CarLog model


class BoomsigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boomsig
        fields = '__all__'

class BarrierOpenLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarrierOpenLog
        fields = '__all__'  # Serializes all fields
