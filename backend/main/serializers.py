'''
Created Date: Friday, July 26th 2024, 1:14:56 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework import serializers
from .models import Product, Subscribe, Cart, Order, Review, Owner


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(ProductDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class SubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscribe
        fields = "__all__"


class SubscribeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscribe
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(SubscribeDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = "__all__"


class OwnerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(OwnerDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"


class CartDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(CartDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(OrderDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ReviewDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(ReviewDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore
