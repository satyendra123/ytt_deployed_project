from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from dashboard.models import CarLog, Boomsig
from django.utils import timezone
import json

gate_status = {}

@api_view(['POST'])
@permission_classes([AllowAny])
def check_vehicle_data(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        gate_id = str(data.get("gate_id"))
        event = data.get("event")

        if not gate_id or not event:
            return JsonResponse({"status": "error", "message": "Invalid data"}, status=400)

        gate_status[gate_id] = event
        print(f"Received data from Gate {gate_id}: {event}")

        return JsonResponse({"status": "success", "message": "Data received"})
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_boom(request):
    gate_id = request.GET.get('gate_id')

    if not gate_id:
        return Response({"error": "Missing gate_id parameter"}, status=400)

    try:
        gate_id = int(gate_id)
        boom = Boomsig.objects.filter(id=gate_id).first()

        if boom and boom.entryboom == 'Y':
            Boomsig.objects.filter(id=gate_id).update(entryboom='N', entrysynctime=timezone.now())
            return Response({"command": "|OPENEN%"}, status=200)

        return Response({"command": "NO_ACTION"}, status=200)

    except ValueError:
        return Response({"error": "Invalid gate_id format"}, status=400)
    except Exception as e:
        return Response({"error": f"Server Error: {str(e)}"}, status=500)
