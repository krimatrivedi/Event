from rest_framework import permissions
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import APIException
from restaurants.models import Event
from rest_framework import status


class IsEventOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if hasattr(view, 'event'):
            event = get_object_or_404(Event, id=view.event.id)
            if event.owner_id != request.user.id:
                raise NotEventOwner()
        return super().has_permission(request, view)


class NotEventOwner(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = {'detail': 'Not event owner'}
