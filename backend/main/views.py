'''
Created Date: Friday, July 26th 2024, 12:08:09 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework import generics
from .serializers import (ProductListSerializer, ProductDetailSerializer, MarketerListSerializer, 
                          MarketerDetailSerializer, CustomerListSerializer, CustomerDetailSerializer,
                          SubscribeListSerializer, SubscribeDetailSerializer)
from .models import Product, Subscribe
from users.models import Customer, Marketer


class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer


class ProductDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer


class SubscribeList(generics.ListCreateAPIView):
    queryset = Subscribe.objects.all()
    serializer_class = SubscribeListSerializer


class SubscribeDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subscribe.objects.all()
    serializer_class = SubscribeDetailSerializer


class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerListSerializer


class CustomerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerDetailSerializer


class MarketerList(generics.ListCreateAPIView):
    queryset = Marketer.objects.all()
    serializer_class = MarketerListSerializer


class MarketerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Marketer.objects.all()
    serializer_class = MarketerDetailSerializer
