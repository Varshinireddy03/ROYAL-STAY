from django.shortcuts import get_object_or_404
from django.db.models import Sum
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .models import User, Room, Reservation, FoodItem, Order, Complaint, Bill
from .serializers import (
    UserSerializer, RoomSerializer, ReservationSerializer,
    FoodItemSerializer, OrderSerializer, ComplaintSerializer, BillSerializer
)

# ----------- PERMISSIONS -------------
class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "MANAGER"


class IsReceptionist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "RECEPTIONIST"


# ----------- USER VIEWSET (PUBLIC REGISTRATION) -------------
from rest_framework_simplejwt.tokens import RefreshToken

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        # Allow registration without login
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        # Use serializer to create the user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT token for the new user
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)



# ----------- ROOMS -------------
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by("number")
    serializer_class = RoomSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsManager()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated()])
    def available(self, request):
        """Get all available rooms"""
        available_rooms = Room.objects.filter(is_available=True).order_by("number")
        serializer = self.get_serializer(available_rooms, many=True)
        return Response(serializer.data)


# ----------- RESERVATIONS -------------
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all().order_by("-created_at")
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user, status="REQUESTED")

    @action(detail=True, methods=['post'], permission_classes=[IsReceptionist])
    def assign_room(self, request, pk=None):
        """Assign a room to a reservation"""
        reservation = self.get_object()
        room_id = request.data.get('room_id')
        if not room_id:
            return Response({"error": "room_id required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            room = Room.objects.get(id=room_id)
            reservation.room = room
            reservation.status = 'CONFIRMED'
            reservation.save()
            # Mark room as unavailable
            room.is_available = False
            room.save()
            return Response(ReservationSerializer(reservation).data, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[IsReceptionist])
    def checkout(self, request, pk=None):
        """Mark a reservation as checked out"""
        reservation = self.get_object()
        reservation.status = 'CHECKED_OUT'
        reservation.save()
        # Mark room as available again
        if reservation.room:
            reservation.room.is_available = True
            reservation.room.save()
        return Response(ReservationSerializer(reservation).data, status=status.HTTP_200_OK)


# ----------- FOOD ITEMS -------------
class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.filter(is_active=True)
    serializer_class = FoodItemSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsManager()]
        return [permissions.IsAuthenticated()]


# ----------- ORDERS -------------
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


# ----------- COMPLAINTS -------------
class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().order_by("-id")
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[IsManager])
    def assign(self, request, pk=None):
        """Assign a complaint to staff member"""
        complaint = self.get_object()
        staff_id = request.data.get('staff_id')
        if not staff_id:
            return Response({"error": "staff_id required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            staff = User.objects.get(id=staff_id, role='STAFF')
            complaint.assigned_to = staff
            complaint.status = 'ASSIGNED'
            complaint.save()
            return Response(ComplaintSerializer(complaint).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Staff member not found"}, status=status.HTTP_404_NOT_FOUND)


# ----------- BILLS -------------
class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsManager()]
        return [permissions.IsAuthenticated()]


# ----------- MANAGER REPORTS ENDPOINTS ---------
@api_view(["GET"])
@permission_classes([IsManager])
def revenue_report(request):
    """Get total revenue from all bills"""
    total_revenue = Bill.objects.aggregate(total=Sum('total'))['total'] or 0
    room_revenue = Bill.objects.aggregate(total=Sum('room_charges'))['total'] or 0
    food_revenue = Bill.objects.aggregate(total=Sum('food_charges'))['total'] or 0
    other_revenue = Bill.objects.aggregate(total=Sum('other_charges'))['total'] or 0
    
    return Response({
        'total_revenue': total_revenue,
        'room_charges': room_revenue,
        'food_charges': food_revenue,
        'other_charges': other_revenue,
    })


# ----------- ME ENDPOINT -------------
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)

