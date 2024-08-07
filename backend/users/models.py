'''
Created Date: Saturday, July 27th 2024, 2:01:02 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from pathlib import Path
import secrets
import string
from django.db import models
from django.contrib.auth.models import User


def rename_image(instance, filename):
    ext = filename.split('.')[-1]
    alphabet = string.ascii_letters + string.digits
    secure_string = ''.join(secrets.choice(alphabet) for _ in range(20))
    newname = f'{secure_string}.{ext}'
    BASE_DIR = Path(__file__).resolve().parent.parent
    new_path = f'{BASE_DIR}/media/profiles/{newname}'
    # new_path = os.path.join("profiles", newname)

    return new_path


# User Information model
class UserInfo(models.Model):
    title_choices = (
        ("Mr", "Mr"),
        ("Mrs", "Mrs"),
        ("Ms", "Ms"),
    )

    gender_choices = (
        ("Male", "Male"),
        ("Female", "Female"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=10, choices=title_choices, null=True)
    gender = models.CharField(max_length=10, choices=gender_choices, null=True)
    d_o_b = models.DateField(null=True)
    phone = models.PositiveBigIntegerField(null=True, unique=True)
    is_customer = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    def __str__(self):
        return str(self.phone)


# Customer model
class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    customer_id = models.CharField(max_length=10, null=True, unique=True)
    subscribed = models.BooleanField(default=False)

    def __str__(self):
        return self.customer_id


# Marketer model
class Marketer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    staff_id = models.CharField(max_length=10, null=True, unique=True)
    profile_image = models.ImageField(upload_to=rename_image, null=True)
    customers = models.ManyToManyField(Customer, blank=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.staff_id
