from django.urls import path, include
from rest_framework import routers
from .views import (
    UserViewSet, RoomViewSet, ReservationViewSet,
    FoodItemViewSet, OrderViewSet, ComplaintViewSet,
    BillViewSet, me, revenue_report
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'rooms', RoomViewSet)
router.register(r'reservations', ReservationViewSet)
router.register(r'food', FoodItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'complaints', ComplaintViewSet)
router.register(r'bills', BillViewSet)

urlpatterns = [
    # JWT Auth
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Current user (must be BEFORE router.urls so /users/me/ matches before /users/{id}/)
    path("users/me/", me, name="me"),

    # Manager reports
    path("report/revenue/", revenue_report, name="revenue_report"),

    # Router urls
    path("", include(router.urls)),
]

