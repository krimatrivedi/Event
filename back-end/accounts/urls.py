
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import FetchMyRestaurantaa,RegisterView, APILogoutView, GetUserView, APIUpdateView, APIUserView, NotificationView, MarkViewedNotification, DeleteNotification

app_name = 'accounts'


urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout_token/', APILogoutView.as_view(), name='logout_token'),
    path('update/', APIUpdateView.as_view(), name='update'),
    path('view/', APIUserView.as_view(), name='update'),
    path('viewres/', FetchMyRestaurantaa.as_view(), name='update'),

    path('<int:user_id>/', GetUserView.as_view(), name='get_user'),
    path('notifications/', NotificationView.as_view(), name='view-notification'),
    path('notifications/viewed/<int:notification_id>/', MarkViewedNotification.as_view(), name='view-notification'),
    path('notifications/delete/<int:pk>/', DeleteNotification.as_view(), name='delete-notification')
]
