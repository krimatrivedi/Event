from typing import OrderedDict
from django.http import Http404, JsonResponse
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, ListCreateAPIView, DestroyAPIView, RetrieveAPIView
from restaurants.permissions import IsRestaurantOwner
from restaurants.models import Comment, MenuItem, Restaurant
from restaurants.serializers import CommentSerializer, MenuItemSerializer, \
    RestaurantSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.
class CreateMenuItem(CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(restaurant=self.restaurant)

class UpdateMenuItem(UpdateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        try:
            get_object_or_404(MenuItem, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Menu item not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

class FetchAllMenuItems(ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Restaurant.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

class DeleteMenuItem(DestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        try:
            get_object_or_404(MenuItem, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Menu item not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        if response.status_code not in [401, 403]:
            return HttpResponseRedirect(reverse('restaurants:menuitems', kwargs={'restaurant_id': self.restaurant.id}))
        return response


class FetchAllRestaurants(ListCreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

class FetchRestaurantByName(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, name=self.kwargs['name'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.restaurant

    def retrieve(self, request, *args, **kwargs):
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given name was not found"}, status=404)
        return ret

# Followers field is many to many so.... look into this. maybe there is a different way to do that.
class FetchFollowersRestaurants(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    # [discuss] to we want to allow everyone to see who is following a particular restaurant?
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
       return self.restaurant

    def retrieve(self, request, *args, **kwargs):
        ret =super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given id was not found"}, status=404)
        ret.data = OrderedDict({'followers': ret.data['followers']})
        return ret

# Comment views
class FetchComments(ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Restaurant.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Restaurant ID for Comments is not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)