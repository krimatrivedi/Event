from django.contrib import admin
from restaurants.models import   ImageModel, ModifiedUser, Event, \
    MenuItem, \
    Notification

# Register your models here.
admin.site.register(Event)
admin.site.register(ModifiedUser)
admin.site.register(MenuItem)
admin.site.register(Notification)
admin.site.register(ImageModel)
