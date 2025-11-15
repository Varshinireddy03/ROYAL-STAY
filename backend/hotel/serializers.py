# hotel/serializers.py
from rest_framework import serializers
from .models import User, Room, Reservation, FoodItem, Order, OrderItem, Complaint, Bill
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ('id','username','email','password','first_name','last_name','role')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    guest = UserSerializer(read_only=True)
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ('created_at',)

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    item = FoodItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=FoodItem.objects.all(), source='item', write_only=True)
    class Meta:
        model = OrderItem
        fields = ('id','item','item_id','quantity')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    placed_by = UserSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ('id','reservation','placed_by','status','scheduled_time','items','created_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        # Auto-populate placed_by from request user
        validated_data['placed_by'] = self.context['request'].user
        order = Order.objects.create(**validated_data)
        for it in items_data:
            OrderItem.objects.create(order=order, item=it['item'], quantity=it.get('quantity',1))
        return order

class ComplaintSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ('created_at','resolved_at')

    def create(self, validated_data):
        # Auto-populate posted_by from request user
        validated_data['posted_by'] = self.context['request'].user
        return super().create(validated_data)

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'

