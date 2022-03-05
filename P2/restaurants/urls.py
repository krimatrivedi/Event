from django.urls import path

from restaurants.views import CreateMenuItem

app_name = 'restaurants'

urlpatterns = [
    path('/menu/new/', CreateMenuItem.as_view(), name='create-menuitem'),
]