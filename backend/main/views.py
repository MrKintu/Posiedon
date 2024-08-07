'''
Created Date: Friday, July 26th 2024, 12:08:09 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework import generics
from .serializers import (ProductListSerializer, ProductDetailSerializer, MarketerListSerializer, 
                          MarketerDetailSerializer, CartListSerializer, CartDetailSerializer, 
                          OrderListSerializer, OrderDetailSerializer, CustomerListSerializer, 
                          CustomerDetailSerializer, SubscribeListSerializer, SubscribeDetailSerializer)
from .models import Product, Subscribe, Cart, Order
from users.models import Customer, Marketer


class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('product_id')
    serializer_class = ProductListSerializer


class ProductDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    lookup_field = 'product_id'


class SubscribeList(generics.ListCreateAPIView):
    queryset = Subscribe.objects.all().order_by('subscribe_id')
    serializer_class = SubscribeListSerializer


class SubscribeDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subscribe.objects.all()
    serializer_class = SubscribeDetailSerializer
    lookup_field = 'subscribe_id'


class CartList(generics.ListCreateAPIView):
    queryset = Cart.objects.all().order_by('cart_id')
    serializer_class = CartListSerializer


class CartDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartDetailSerializer
    lookup_field = 'cart_id'


class OrderList(generics.ListCreateAPIView):
    queryset = Order.objects.all().order_by('order_id')
    serializer_class = OrderListSerializer


class OrderDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    lookup_field = 'order_id'


class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all().order_by('customer_id')
    serializer_class = CustomerListSerializer


class CustomerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerDetailSerializer
    lookup_field = 'customer_id'


class MarketerList(generics.ListCreateAPIView):
    queryset = Marketer.objects.all().order_by('staff_id')
    serializer_class = MarketerListSerializer


class MarketerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Marketer.objects.all()
    serializer_class = MarketerDetailSerializer
    lookup_field = 'staff_id'
