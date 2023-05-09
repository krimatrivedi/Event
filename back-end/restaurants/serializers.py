from rest_framework import serializers
from restaurants.models import  Notification
from restaurants.models import Event, MenuItem, ImageModel
from accounts.serializers import ModifiedUserSerializer


class ImageModelSerializer(serializers.ModelSerializer):
    event = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "event"):
            self.event = rep.get("event", None)
        rep.pop('event')
        rep.update({'restaurant_id': self.event.id})
        return rep

    def create(self, validated_data):
        if 'ref_img' not in validated_data:
            raise serializers.ValidationError({"detail": "Image is required"})
        return super().create(validated_data)

    class Meta:
        model = ImageModel
        fields = ['id', 'ref_img', 'event']

class RestaurantOwnerSerializer(serializers.ModelSerializer):
     class Meta:
        model = Event
        fields = '__all__'
        #fields = ['id', 'owner', 'name', 'address',
           #       'email',  'views', 'likes', 'logo','date','time']


class EventSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField()
    views = serializers.ReadOnlyField()
    likes = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        self.owner = rep.get("owner", None)
        if self.owner:
            rep.pop('owner')
            rep.update({'owner_id': self.owner.id})

            images = []
            likes = []

            for image in ImageModel.objects.filter(event=rep["id"]).all().iterator():
                images.append(ImageModelSerializer(image).data)

          

            if "likes" in rep:
                for like in rep["likes"].all().iterator():
                    likes.append(ModifiedUserSerializer(like).data)

            rep.update({
                       "likes": likes, "images": images})
        return rep

    def update(self, instance, validated_data):
       
        if 'likes' in validated_data:
            # add a follower to the many-to-many field of followers
            likes = validated_data.pop('likes')
            for like in likes:
                instance.likes.add(like)
        return super().update(instance, validated_data)

    class Meta:
        model = Event
        fields = ['id', 'owner', 'name', 'address',
                  'email',  'views', 'likes', 'logo','date','time']


class MenuItemSerializer(serializers.ModelSerializer):
    event = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "event"):
            self.event = rep.get("event", None)
        rep.pop('event')
        rep.update({'restaurant_id': self.event.id})
        return rep

    def create(self, validated_data):
        self.event = validated_data.get("event", None)
    
        return super().create(validated_data)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description',
                  'price', 'picture', 'event']

