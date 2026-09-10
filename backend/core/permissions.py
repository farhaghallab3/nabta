from rest_framework import permissions


class IsFarmer(permissions.BasePermission):
    message = "Only farmer accounts can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_farmer", False)
        )


class IsConsumer(permissions.BasePermission):
    message = "Only consumer accounts can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_consumer", False)
        )


class IsBatchOwnerOrReadOnly(permissions.BasePermission):
    """Read for anyone; writes only for the farmer who owns the batch's farm."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_farmer", False)
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        farm = obj.farm if hasattr(obj, "farm") else obj
        return farm.owner_id == request.user.id
