'''
Created Date: Friday, July 26th 2024, 12:08:09 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.db import models
from users.models import Customer, Marketer


# Product Model
class Product(models.Model):
    target_choices = (
        ("B2B", "Business to Business Marketing"),
        ("B2C", "Business to Customer Marketing"),
    )

    product_types = (
        (1, "Branding and Identity Services"), 
        (2, "Marketing and Advertising Services"), 
        (3, "Content Creation and Strategy"), 
        (4, "E-Commerce Solutions")
    )

    product_id = models.CharField(max_length=10, null=True, blank=True, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(null=True)
    price = models.FloatField(blank=True)
    marketers = models.ManyToManyField(Marketer, blank=True, related_name='product_marketers')
    target = models.CharField(max_length=50, choices=target_choices, null=True)
    type = models.CharField(max_length=50, choices=product_types, null=True) # type: ignore

    def __str__(self):
        return self.product_id


# Subscription Model
class Subscribe(models.Model):
    subscribe_id = models.CharField(max_length=15, null=True, blank=True, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(null=True)
    price = models.FloatField(blank=True)
    products = models.ManyToManyField(Product, blank=True, related_name='subscribe_products')

    def __str__(self):
        return self.subscribe_id


# Ownership Model
class Owner(models.Model):
    owner_id = models.CharField(max_length=10, null=True, blank=True, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, 
                                 related_name='owner_customer')
    products = models.ManyToManyField(Product, blank=True, related_name='owner_products')
    subscribe = models.ForeignKey(Subscribe, on_delete=models.SET_NULL, null=True, blank=True, 
                                  related_name='owner_subscribe')
    start = models.DateTimeField(auto_now_add=True)
    stop = models.DateTimeField()
    has_product = models.BooleanField(default=False)
    has_subscribe = models.BooleanField(default=False)
    auto_product = models.BooleanField(default=False)
    auto_subscribe = models.BooleanField(default=False)

    def __str__(self):
        return self.owner_id


# Cart Model
class Cart(models.Model):
    cart_id = models.CharField(max_length=10, null=True, blank=True, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, 
                                 related_name='cart_customer')
    products = models.ManyToManyField(Product, blank=True, related_name='cart_products')
    subscribe = models.ForeignKey(Subscribe, on_delete=models.SET_NULL, null=True, blank=True, 
                                  related_name='cart_subscribe')
    total = models.FloatField(blank=True)

    def __str__(self):
        return self.cart_id


# Order Model
class Order(models.Model):
    order_id = models.CharField(max_length=15, null=True, blank=True, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='order_customer')
    cart = models.ForeignKey(Cart, on_delete=models.SET_NULL, null=True, blank=True, 
                             related_name='order_cart')
    date = models.DateTimeField(auto_now_add=True)
    amount = models.FloatField(blank=True)

    def __str__(self):
        return self.order_id


# Customer Review Model
class Review(models.Model):
    review_id = models.CharField(max_length=15, null=True, blank=True, unique=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='review_product')
    subcribe = models.ForeignKey(Subscribe, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='review_subscribe')
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='review_customer')
    rating = models.IntegerField()
    review = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.review_id
