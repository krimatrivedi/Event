from typing import OrderedDict
from django.http import Http404, JsonResponse
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, ListAPIView, \
    DestroyAPIView
from restaurants.permissions import IsEventOwner
from restaurants.models import MenuItem, Event
from restaurants.serializers import MenuItemSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponseRedirect
from django.urls import reverse


# ==================== MenuItem Views ========================
class CreateMenuItem(CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsEventOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(
                Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(event=self.event)


class UpdateMenuItem(UpdateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsEventOwner]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(
                Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)

        try:
            get_object_or_404(MenuItem, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Menu item not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)


class FetchMenuItems(ListAPIView):
    """
    Feth all menu items corresponded to a specific restaurant_id
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Event.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Event not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return MenuItem.objects.filter(restaurant_id=self.kwargs['restaurant_id'])


class DeleteMenuItem(DestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsEventOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(
                Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)

        try:
            get_object_or_404(MenuItem, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Menu item not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        if response.status_code not in [401, 403, 404]:
            return HttpResponseRedirect(reverse('restaurants:menuitems', kwargs={'restaurant_id': self.event.id}))
        return response
