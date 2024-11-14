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


class Customer(models.Model):
    INDUSTRY_CHOICES = [
        ("Transportation", "Transportation"),
        ("Pharmaceutical", "Pharmaceutical"),
        ("Telecommunications", "Telecommunications"),
        ("Manufacturing", "Manufacturing"),
        ("Mining", "Mining"),
        ("Hospitality", "Hospitality"),
        ("Media and News", "Media and News"),
        ("Agriculture", "Agriculture"),
        ("Engineering and Technology", "Engineering and Technology"),
        ("Education", "Education"),
        ("Finance and Economics", "Finance and Economics"),
        ("Health Care", "Health Care"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    customer_id = models.CharField(max_length=10, unique=True, null=True, blank=True)
    business = models.CharField(max_length=100, null=True, blank=True)
    years = models.IntegerField(null=True)
    phone = models.PositiveBigIntegerField(null=True, unique=True)
    description = models.TextField(null=True)
    industry = models.CharField(max_length=100, choices=INDUSTRY_CHOICES, blank=True, null=True) # type: ignore
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.customer_id


class Staff(models.Model):
    DIVISION_TYPES = [
        ("Content Creation and Strategy", "Content Creation and Strategy"),
        ("Marketing and Advertising Services", "Marketing and Advertising Services"), 
        ("Branding and Identity Services", "Branding and Identity Services"),  
        ("E-Commerce Solutions", "E-Commerce Solutions")
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    staff_id = models.CharField(max_length=10, unique=True, null=True, blank=True)
    division = models.CharField(max_length=50, choices=DIVISION_TYPES, null=True) # type: ignore
    phone = models.PositiveBigIntegerField(null=True, unique=True)
    profile_image = models.ImageField(upload_to=rename_image, null=True)
    customers = models.ManyToManyField(Customer, blank=True, related_name='staff_customers')
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.staff_id
