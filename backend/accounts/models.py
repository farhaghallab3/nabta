from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with a role so the API can gate farmer vs consumer actions."""

    class Role(models.TextChoices):
        CONSUMER = "consumer", "Consumer"
        FARMER = "farmer", "Farmer"

    role = models.CharField(
        max_length=20, choices=Role.choices, default=Role.CONSUMER
    )

    @property
    def is_farmer(self):
        return self.role == self.Role.FARMER

    @property
    def is_consumer(self):
        return self.role == self.Role.CONSUMER

    def __str__(self):
        return f"{self.username} ({self.role})"
