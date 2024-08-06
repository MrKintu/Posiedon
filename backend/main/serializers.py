'''
Created Date: Friday, July 26th 2024, 1:14:56 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework import serializers
from .models import Product, Subscribe
from users.models import Marketer, Customer


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        # exclude = ["user", "customer"]
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(ProductListSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(ProductDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore


class SubscribeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscribe
        # exclude = ["user", "customer"]
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(SubscribeListSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore


class SubscribeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscribe
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(SubscribeDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore


class MarketerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketer
        # exclude = ["user", "customer"]
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(MarketerListSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore


class MarketerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketer
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(MarketerDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore


class CustomerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        # exclude = ["user", "customer"]
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(CustomerListSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore


class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(CustomerDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1 # type: ignore
