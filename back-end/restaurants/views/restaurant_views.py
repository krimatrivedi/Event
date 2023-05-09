from typing import OrderedDict
from django.http import Http404, JsonResponse
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, ListAPIView, \
    DestroyAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework import generics
from accounts.models import ModifiedUser
from restaurants.permissions import IsEventOwner
from restaurants.models import ImageModel, MenuItem, Notification, Event
from restaurants.serializers import ImageModelSerializer, EventSerializer,RestaurantOwnerSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponseRedirect
from django.urls import reverse

#view uses serializers and permission if needed(user login or if user is ownwer),
#user's info is taken through usermodified model from accounts folder.

class CreateEvent(CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        self.owner = ModifiedUser.objects.get(id=request.user.id)
        if Event.objects.filter(id=self.request.user.id):
            return super().create(request, *args, **kwargs)
        else:
            return super().create(request, *args, **kwargs)
            print("erorororo")

    def perform_create(self, serializer):
        return serializer.save(owner=self.owner)


class FetchAllEvents(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


class FetchRestaurantById(RetrieveAPIView):
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(Event, id=self.kwargs['restaurant_id'])
            print(self.kwargs['restaurant_id'],"mukab")
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.event

    def retrieve(self, request, *args, **kwargs):
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Event with the given name was not found"}, status=404)
        return ret

#user's event is fetched through id
class FetchMyEvent(ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsEventOwner]
    
    def get_queryset(self):
        
        queryset= Event.objects.filter(owner=ModifiedUser.objects.get(id=self.request.user.id))
        
        return queryset
    
class FetchIfLikedEvent(ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       
        liked=Event.objects.filter(likes__id=self.request.user.id)
       
        return liked

   


class UpdateRestaurantInfo(UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsEventOwner]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)


class LikeRestaurant(UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Making this endpoint ignore the given body
        for field in serializer.fields:
            serializer.fields[field].read_only = True
        return serializer

    def update(self, request, *args, **kwargs):
        # Check if the current restaurant is already followed by this user
        if self.event.likes.filter(id=self.request.user.id).exists():
            return JsonResponse({"detail": "User already likes this event"}, status=409)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        current_user = ModifiedUser.objects.get(id=self.request.user.id)
        Notification.objects.create(type="LIKEDRES", user=self.event.owner,
                                    event=self.event, actor_user=current_user)
        serializer.validated_data.update({'likes': [current_user]})
        return super().perform_update(serializer)


class UnlikeRestaurant(UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Making this endpoint ignore the given body
        for field in serializer.fields:
            serializer.fields[field].read_only = True
        return serializer

    def update(self, request, *args, **kwargs):
        # Check if the current Event is followed by this user
        if not self.event.likes.filter(id=self.request.user.id).exists():
            return JsonResponse({"detail": "User does not like this eveny"}, status=409)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        self.event.likes.remove(ModifiedUser.objects.get(id=self.request.user.id))
        return super().perform_update(serializer)

class FetchImagesRestaurant(ListAPIView):
    """Fetch all images for a specific event"""
    queryset = ImageModel.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Event.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Specified event was not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return ImageModel.objects.filter(event=self.kwargs['restaurant_id'])

class FetchRestaurantByArg(ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Event.objects.all()
        res_name = self.request.GET.get('name', None)
        res_food = self.request.GET.get('food', None)
        res_postal_code = self.request.GET.get('name', None)
        if res_name:
            # Reference: https://stackoverflow.com/questions/45190151/there-is-a-way-to-check-if-a-model-field-contains-a-substring
            if res_postal_code:
                queryset = queryset.filter(name__icontains=res_name, postal_code=res_postal_code).order_by('id')
            else:
                queryset = queryset.filter(name__icontains=res_name).order_by('id')
        elif res_food:
            desired_restaurants = set()
            for menu_item in MenuItem.objects.all().iterator():
                if res_food in menu_item.name:
                    desired_restaurants.add(menu_item.event.id)
            if res_postal_code and res_name:
                queryset = queryset.filter(id__in=desired_restaurants, name=res_name, postal_code=res_postal_code).order_by('id')
            elif res_name:
                queryset = queryset.filter(id__in=desired_restaurants, name=res_name).order_by('id')
            elif res_postal_code:
                queryset = queryset.filter(id__in=desired_restaurants, postal_code=res_postal_code).order_by('id')
            else:
                queryset = queryset.filter(id__in=desired_restaurants).order_by('id')

        elif res_postal_code:
            queryset = queryset.filter(postal_code=res_postal_code).order_by('id')
        return queryset

class UploadRestaurantImage(CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = [IsAuthenticated, IsEventOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(event=self.event)

class RemoveRestaurantImage(DestroyAPIView):
    queryset = ImageModel.objects.all()
    serializer_class = ImageModel
    permission_classes = [IsAuthenticated, IsEventOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.event = get_object_or_404(Event, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Event not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not ImageModel.objects.filter(id=self.kwargs['image_id'], event=self.event).exists():
            return JsonResponse({"detail": "Image does not exist"}, status=404)
        self.kwargs['pk'] = self.kwargs['image_id']
        return super().destroy(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):

        response = super().finalize_response(request, response, *args, **kwargs)
        if response.status_code not in [401, 403, 404]:
            return HttpResponseRedirect(reverse('restaurants:get-restaurant-imgs', kwargs={'restaurant_id': self.event.id}))
        return response
