# hotel/admin.py
from django.contrib import admin
from .models import User, Room, Reservation, FoodItem, Order, OrderItem, Complaint, Bill
from django.contrib.auth.admin import UserAdmin

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Extra', {'fields':('role',)}),
    )

admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(FoodItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Complaint)
admin.site.register(Bill)

