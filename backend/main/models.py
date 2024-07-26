'''
Created Date: Friday, July 26th 2024, 12:08:09 am
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

    return new_path


# Customer model
class Customer(models.Model):
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
    title = models.CharField(max_length=100, choices=title_choices, null=True)
    gender = models.CharField(max_length=10, choices=gender_choices, null=True)
    d_o_b = models.DateField(null=True)
    phone = models.CharField(max_length=100, null=True)
    profile_image = models.ImageField(upload_to=rename_image, null=True)

    def __str__(self):
        return self.phone


# Marketer model
class Marketer(models.Model):
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
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=100, choices=title_choices, null=True)
    gender = models.CharField(max_length=10, choices=gender_choices, null=True)
    d_o_b = models.DateField(null=True)
    phone = models.CharField(max_length=100, null=True)
    profile_image = models.ImageField(upload_to=rename_image, null=True)

    def __str__(self):
        return self.phone

# Product Model
class Product(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True)
    price = models.FloatField()

    def __str__(self):
        return self.title
