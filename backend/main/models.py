'''
Created Date: Friday, July 26th 2024, 12:08:09 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.db import models
from users.models import Customer, Marketer


# Product Model
class Product(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True)
    price = models.FloatField()
    marketers = models.ManyToManyField(Marketer, blank=True)

    def __str__(self):
        return self.title


# Subscription Model
class Subscribe(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True)
    price = models.FloatField(blank=True)
    customers = models.ManyToManyField(Customer, blank=True)
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return self.title
