from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import ModifiedUser
#from django.contrib.auth.models import ModifiedUser
from phonenumber_field.modelfields import PhoneNumberField

# Models created

"""
Event (name, address, Contact information, logo, views, likes (many to many field to User)) 
"""


class Event(models.Model):
    owner = models.ForeignKey(to=ModifiedUser, related_name='restaurant_owner', on_delete=models.CASCADE)


    name = models.CharField(max_length=200)
    date = models.DateTimeField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)

    address = models.CharField(max_length=200)
    email = models.CharField(max_length=100)
    views = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    likes = models.ManyToManyField(to=ModifiedUser, related_name="restaurant_likes", blank=True)
    logo = models.ImageField(upload_to='restaurant_logo/', null=True, blank=True)

"""
ImageModel(referred image, restaurant fk)
"""

class ImageModel(models.Model):
    ref_img = models.ImageField(upload_to='restaurant_pics/', null=True, blank=True)
    event = models.ForeignKey(to=Event, related_name='restaurant_images', on_delete=models.CASCADE)

"""
(user id, date, restaurant id)
"""

"""
Blog (Title, Image, Contents, publish date, restaurant id foreign key, likes (many to many field to User))
"""

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    picture = models.ImageField(upload_to='menu/', null=True, blank=True)
    event = models.ForeignKey(to=Event, on_delete=models.CASCADE, related_name='menuitems')


"""
Notification
"""


class Notification(models.Model):
    user = models.ForeignKey(to=ModifiedUser, on_delete=models.CASCADE, related_name='users')
    # Enum, all possible notification types
    NOTIFICATION_TYPE = (
        ("MENUUPDATE", "menuupdate"),
        ("LIKEDRES", "likedres"),
    )
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPE, default="GENERAL")
    # Indicates whether the notification was viewed or not.
    viewed = models.BooleanField(default=False)
    # The user that receiver the notification
    event = models.ForeignKey(to=Event, on_delete=models.CASCADE, blank=True, null=True)
    # A user that triggered the notification. For example, a follower, liker or a commenter.
    actor_user = models.ForeignKey(to=ModifiedUser, on_delete=models.CASCADE, blank=True, null=True)
