from django.urls import path

from restaurants.views.menuitem_views import *
from restaurants.views.restaurant_views import *
app_name = 'restaurants'

urlpatterns = [
    
    # Restaurant endpoints
    path('new/', CreateEvent.as_view(), name='event-create'),
    path('all/', FetchAllEvents.as_view(), name='events'),
    #path('owned/', FetchMyRestaurant.as_view(), name='get-owned-restaurant'),
    #view=url for only user's posts
    path('eventowner/', FetchMyEvent.as_view(), name='update'),
    #view-url for user's liked posts
    path('like/', FetchIfLikedEvent.as_view(), name='update'),
 
    path('doeslike/<int:restaurant_id>/',
         FetchIfLikedEvent.as_view(), name='restaurant-doeslike'),
    path('info/<int:restaurant_id>/',
         FetchRestaurantById.as_view(), name='restaurant-byid'),
     path('search/', FetchRestaurantByArg.as_view(), name='restaurant-byarg'),

    
    path('<int:restaurant_id>/edit/',
         UpdateRestaurantInfo.as_view(), name='restaurant-edit'),
   
    path('<int:restaurant_id>/like/',
         LikeRestaurant.as_view(), name='restaurant-like'),
    path('<int:restaurant_id>/unlike/',
         UnlikeRestaurant.as_view(), name='restaurant-unlike'),
    path('<int:restaurant_id>/images/upload/',
         UploadRestaurantImage.as_view(), name='upload-restaurant-img'),
    path('<int:restaurant_id>/images/<int:image_id>/remove/',
         RemoveRestaurantImage.as_view(), name='remove-restaurant-img'),
    path('<int:restaurant_id>/images/',
         FetchImagesRestaurant.as_view(), name='get-restaurant-imgs'),

   
]
