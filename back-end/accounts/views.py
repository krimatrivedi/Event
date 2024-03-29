from django.http import Http404, JsonResponse
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.generics import RetrieveAPIView, get_object_or_404, UpdateAPIView, DestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from restaurants.models import Event

from .models import ModifiedUser
from restaurants.models import Notification
from .serializers import RegisterSerializer, ModifiedUserSerializer, NotificationRecordsSerializer
from restaurants.serializers import  EventSerializer


# Create your views here.


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class APILogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if self.request.data.get('all'):
            for token in OutstandingToken.objects.filter(user=request.user):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({"status": "OK, goodbye, all refresh tokens blacklisted"})
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "OK, goodbye"})


class APIUserView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ModifiedUserSerializer

    def get_object(self):
        return get_object_or_404(ModifiedUser, id=self.request.user.id)
class FetchMyRestaurantaa(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EventSerializer
    print("was iii here?")
    def get_object(self):
        print(self.request.user.id,"uderer")
        return get_object_or_404(Event, id=self.request.user.id)

class GetUserView(APIView):
    """Get user by url provided user_id"""
    permission_classes = (AllowAny,)

    def get(self, request, user_id):
        user = get_object_or_404(ModifiedUser, id=self.kwargs['user_id'])
        serializer = ModifiedUserSerializer(user)
        return Response(serializer.data)

# class GetUserView(APIView):
#     permission_classes = (IsAuthenticated,)
#     serializer = ModifiedUserSerializer

#     def get(self, request, *args, **kwargs):
#         user = get_object_or_404(ModifiedUser, id=self.request.user.id)
#         return Response(serializer.data)


class MarkViewedNotification(UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationRecordsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.notification = get_object_or_404(
                Notification, id=self.kwargs['notification_id'])
        except Http404:
            return JsonResponse({"detail": "Notification not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # check if owner of notification
        if self.notification.user.id != self.request.user.id:
            return JsonResponse({"detail": "Not allowed to view this notification"}, status=403)
        self.kwargs['pk'] = self.kwargs['notification_id']
        self.kwargs['pk'] = self.kwargs['notification_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.validated_data.update({'viewed': True})
        return super().perform_update(serializer)

class DeleteNotification(DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationRecordsSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.notification = get_object_or_404(
                Notification, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Notification not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    

class NotificationView(generics.ListAPIView):
    # queryset = Notification.objects.all()
    serializer_class = NotificationRecordsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        curr_user = ModifiedUser.objects.get(id=self.request.user.id)
        return Notification.objects.filter(user=curr_user).order_by('id')


class APIUpdateView(generics.UpdateAPIView):
    queryset = ModifiedUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ModifiedUserSerializer
    http_method_names = ["patch"]

    def update(self, request, *args, **kwargs):
        self.kwargs["pk"] = self.request.user.id
        return super().update(request, *args, **kwargs)
