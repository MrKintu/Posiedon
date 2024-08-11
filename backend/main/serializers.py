'''
Created Date: Friday, July 26th 2024, 1:14:56 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

import secrets
import string
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from users.models import Customer, Marketer
from .models import Product, Subscribe, Cart, Order, Review, Owner


# Create Unique Ids
def new_ID(switch):
    alphabet = string.ascii_uppercase + string.digits
    if switch:
        secure_string = ''.join(secrets.choice(alphabet) for _ in range(6))
    else:
        new_string = ''.join(secrets.choice(alphabet) for _ in range(10))
        secure_string = f'MAZU-{new_string}'

    return secure_string


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
    
    def create(self, validated_data):
        secure_string = new_ID(True)
        new_id = f'PDT-{secure_string}'

        product = Product.objects.create(
            product_id=new_id,
            title=validated_data.get('title'),
            description=validated_data.get('description'),
            price=validated_data.get('price'),
            target=validated_data.get('target'),
            type=validated_data.get('type')
        )
        if 'marketers' in validated_data:
            for single in validated_data.get('marketers'):
                marketer = get_object_or_404(Marketer, marketer_id=single)
                product.marketers.set(marketer) # type: ignore

        return product


class ProductDetailSerializer(serializers.ModelSerializer):
    subscribe_products = serializers.StringRelatedField(many=True)
    owner_products = serializers.StringRelatedField(many=True)
    cart_products = serializers.StringRelatedField(many=True)
    review_product = serializers.StringRelatedField(many=True)

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
    
    def create(self, validated_data):
        new_id = new_ID(False)

        subscribe = Subscribe.objects.create(
            subscribe_id=new_id,
            title=validated_data.get('title'),
            description=validated_data.get('description'),
            price=validated_data.get('price'),
        )
        if 'products' in validated_data:
            for single in validated_data.get('products'):
                product = get_object_or_404(Product, product_id=single)
                subscribe.products.set(product) # type: ignore

        return subscribe


class SubscribeDetailSerializer(serializers.ModelSerializer):
    owner_subscribe = serializers.StringRelatedField(many=True)
    cart_subscribe = serializers.StringRelatedField(many=True)
    review_subscribe = serializers.StringRelatedField(many=True)

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
    
    def create(self, validated_data):
        secure_string = new_ID(True)
        new_id = f'OWN-{secure_string}'
        customer = get_object_or_404(Customer, customer_id=validated_data.get('customer'))

        owner = Owner.objects.create(
            owner_id=new_id,
            customer=customer,
            start=validated_data.get('start'),
            stop=validated_data.get('stop'),
            has_product=validated_data.get('has_product'),
            has_subscribe=validated_data.get('has_subscribe'),
            auto_product=validated_data.get('auto_product'),
            auto_subscribe=validated_data.get('auto_subscribe')
        )
        if 'products' in validated_data:
            for single in validated_data.get('products'):
                product = get_object_or_404(Product, product_id=single)
                owner.products.set(product) # type: ignore
        if 'subscribe' in validated_data:
            subscibe = get_object_or_404(Subscribe, subscribe_id=validated_data.get('subscribe'))
            owner.subscribe = subscibe
            owner.save()

        return owner


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
    
    def create(self, validated_data):
        secure_string = new_ID(True)
        new_id = f'CRT-{secure_string}'
        customer = get_object_or_404(Customer, customer_id=validated_data.get('customer'))

        cart = Cart.objects.create(
            cart_id=new_id,
            customer=customer,
            total=validated_data.get('total')
        )
        if 'products' in validated_data:
            for single in validated_data.get('products'):
                product = get_object_or_404(Product, product_id=single)
                cart.products.set(product) # type: ignore
        if 'subscribe' in validated_data:
            subscibe = get_object_or_404(Subscribe, subscribe_id=validated_data.get('subscribe'))
            cart.subscribe = subscibe
            cart.save()

        return cart


class CartDetailSerializer(serializers.ModelSerializer):
    order_cart = serializers.StringRelatedField(many=True)

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
    
    def create(self, validated_data):
        new_id = new_ID(False)
        customer = get_object_or_404(Customer, customer_id=validated_data.get('customer'))
        cart = get_object_or_404(Cart, cart_id=validated_data.get('cart'))

        order = Order.objects.create(
            order_id=new_id,
            customer=customer,
            cart=cart,
            amount=validated_data.get('amount')
        )

        return order


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
    
    def create(self, validated_data):
        new_id = new_ID(False)
        customer = get_object_or_404(Customer, customer_id=validated_data.get('customer'))

        review = Review.objects.create(
            review_id=new_id,
            customer=customer,
            rating=validated_data.get('rating'),
            review=validated_data.get('review')
        )
        if 'product' in validated_data:
            product = get_object_or_404(Product, product_id=validated_data.get('product'))
            review.product = product
            review.save()
        if 'subscribe' in validated_data:
            subscribe = get_object_or_404(Subscribe, subscribe_id=validated_data.get('subscribe'))
            review.subcribe = subscribe
            review.save()

        return review


class ReviewDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(ReviewDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore
