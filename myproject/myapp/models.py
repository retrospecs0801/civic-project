from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings   # gets AUTH_USER_MODEL

# Create your models(tables) here.

class issues(models.Model):
    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,  # this variable points to CustomUser table, cant write it directly django performs inbuilt functions
    on_delete=models.CASCADE,
    null=True, blank=True,
    db_column="user_id",
    related_name="issues",
     )
    title = models.CharField(max_length=500 , default = " ")
    category = models.CharField(max_length=100 , default = " ")
    description = models.TextField(default=" ")
    image = models.ImageField(upload_to='uploads/')
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.CharField(max_length=50,default = " ")
    status = models.CharField(max_length=20, default="submitted")
    created_at = models.DateTimeField(auto_now_add=True)

class CustomUser(AbstractUser):
    ROLE_CHOICES = ( 
                    ('user','User'),
                    ('admin','Admin'),
                    )
    role = models.CharField(max_length=10,choices= ROLE_CHOICES,default='user')
    