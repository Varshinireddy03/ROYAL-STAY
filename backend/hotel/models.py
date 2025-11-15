# hotel/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('GUEST', 'Guest'),
        ('RECEPTIONIST', 'Receptionist'),
        ('MANAGER', 'Manager'),
        ('STAFF', 'Staff'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='GUEST')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Room(models.Model):
    ROOM_TYPE = (
        ('SINGLE', 'Single'),
        ('DOUBLE', 'Double'),
    )
    AC_CHOICES = (
        ('AC', 'AC'),
        ('NON-AC', 'Non-AC'),
    )

    number = models.CharField(max_length=10, unique=True)
    floor = models.IntegerField(default=1)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPE)
    ac = models.CharField(max_length=10, choices=AC_CHOICES)
    tariff = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Room {self.number} ({self.room_type}, {self.ac})"


class Reservation(models.Model):
    STATUS = (
        ('REQUESTED','Requested'),
        ('CONFIRMED','Confirmed'),
        ('CHECKED_IN','CheckedIn'),
        ('CHECKED_OUT','CheckedOut'),
        ('CANCELLED','Cancelled')
    )
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    room = models.ForeignKey(Room, null=True, blank=True, on_delete=models.SET_NULL)
    checkin_date = models.DateField()
    checkout_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS, default='REQUESTED')
    created_at = models.DateTimeField(auto_now_add=True)
    token = models.CharField(max_length=50, blank=True, null=True)  # assigned by receptionist

    def __str__(self):
        return f"Reservation {self.id} - {self.guest.username} - {self.status}"


class FoodItem(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS = (
        ('PLACED','Placed'),
        ('PREPARING','Preparing'),
        ('READY','Ready'),
        ('DELIVERED','Delivered'),
        ('CANCELLED','Cancelled')
    )
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='orders')
    placed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS, default='PLACED')
    scheduled_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def total_amount(self):
        return sum([oi.quantity * oi.item.price for oi in self.items.all()])

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item = models.ForeignKey(FoodItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)


class Complaint(models.Model):
    STATUS = (
        ('OPEN','Open'),
        ('ASSIGNED','Assigned'),
        ('RESOLVED','Resolved'),
    )
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='complaints')
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=200)
    detail = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='OPEN')
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_complaints')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)


class Bill(models.Model):
    reservation = models.OneToOneField(Reservation, on_delete=models.CASCADE, related_name='bill')
    room_charges = models.DecimalField(max_digits=9, decimal_places=2, default=0)
    food_charges = models.DecimalField(max_digits=9, decimal_places=2, default=0)
    other_charges = models.DecimalField(max_digits=9, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def recalc(self):
        # basic recalc example
        self.total = (self.room_charges or 0) + (self.food_charges or 0) + (self.other_charges or 0)
        return self.total

