'''
Created Date: Friday, July 26th 2024, 12:08:09 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework import generics
from .serializers import (ProductSerializer, ProductDetailSerializer, CartSerializer, 
                          CartDetailSerializer, OrderSerializer, OrderDetailSerializer, 
                          SubscribeSerializer, SubscribeDetailSerializer, ReviewSerializer,
                          ReviewDetailSerializer, OwnerSerializer, OwnerDetailSerializer)
from .models import Product, Subscribe, Cart, Order, Review, Owner


# Fetch all Products
class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('product_id')
    serializer_class = ProductSerializer


# Fetch Single Product
class ProductDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    lookup_field = 'product_id'


# Fetch all subscriptions
class SubscribeList(generics.ListCreateAPIView):
    queryset = Subscribe.objects.all().order_by('subscribe_id')
    serializer_class = SubscribeSerializer


# Fetch single Subscription
class SubscribeDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subscribe.objects.all()
    serializer_class = SubscribeDetailSerializer
    lookup_field = 'subscribe_id'


# Fetch all Owners
class OwnerList(generics.ListCreateAPIView):
    queryset = Owner.objects.all().order_by('owner_id')
    serializer_class = OwnerSerializer


# Fetch Single Owner
class OwnerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerDetailSerializer
    lookup_field = 'owner_id'


# Fetch all Carts
class CartList(generics.ListCreateAPIView):
    queryset = Cart.objects.all().order_by('cart_id')
    serializer_class = CartSerializer


# Fetch Single Cart
class CartDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartDetailSerializer
    lookup_field = 'cart_id'


# Fetch All Orders
class OrderList(generics.ListCreateAPIView):
    queryset = Order.objects.all().order_by('order_id')
    serializer_class = OrderSerializer


# Fetch Single Order
class OrderDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    lookup_field = 'order_id'


# Fetch All Reviews
class ReviewList(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('review_id')
    serializer_class = ReviewSerializer


# Fetch Single Review
class ReviewDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewDetailSerializer
    lookup_field = 'review_id'
