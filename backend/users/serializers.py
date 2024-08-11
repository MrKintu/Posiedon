'''
Created Date: Wednesday, August 7th 2024, 12:00:08 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

import secrets
import string
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Marketer, Customer, UserInfo


# Create User Ids
def new_ID(switch):
    alphabet = string.ascii_uppercase + string.digits
    secure_string = ''.join(secrets.choice(alphabet) for _ in range(6))
    new_id = f'STF-{secure_string}' if switch else f'CUS-{secure_string}'

    return new_id


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['title', 'gender', 'd_o_b', 'phone']


class UserInfoDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super(UserInfoDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'business', 'description', 'industry', 'city', 'state', 
                  'country']


class CustomerDetailSerializer(serializers.ModelSerializer):
    owner_customer = serializers.StringRelatedField(many=True)
    cart_customer = serializers.StringRelatedField(many=True)
    order_customer = serializers.StringRelatedField(many=True)
    review_customer = serializers.StringRelatedField(many=True)
    marketer_customers = serializers.StringRelatedField(many=True)

    class Meta:
        model = Customer
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(CustomerDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class MarketerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketer
        fields = ['staff_id', 'profile_image', 'customers', 'is_admin']


class MarketerDetailSerializer(serializers.ModelSerializer):
    product_marketers = serializers.StringRelatedField(many=True)

    class Meta:
        model = Marketer
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(MarketerDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore
    

class UserSerializer(serializers.ModelSerializer):
    userinfo = UserInfoSerializer(required=True)
    customer = CustomerSerializer(required=False)
    marketer = MarketerSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'password', 'email', 'first_name', 'last_name', 'is_staff', 
                  'userinfo', 'customer', 'marketer']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        userinfo_data = validated_data.pop('userinfo')
        customer_data = validated_data.pop('customer', None)
        marketer_data = validated_data.pop('marketer', None) 

        is_staff = validated_data.get('is_staff', False)
        user_id = new_ID(is_staff)
        
        user = User.objects.create_user(
            username=user_id,
            email=validated_data.get('email'),
            password=validated_data.get('password'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            is_staff=is_staff
        )

        UserInfo.objects.create(user=user, **userinfo_data)

        if is_staff:
            marketer = Marketer.objects.create(
                user=user, 
                staff_id=user_id, 
                profile_image=marketer_data.get('profile_image'), 
                is_admin=marketer_data.get('is_admin')
            )
            if 'customers' in marketer_data:
                for single in marketer_data.get('customers'):
                    customer = get_object_or_404(Customer, customer_id=single)
                    marketer.customers.set(customer) # type: ignore
        else:
            Customer.objects.create(
                user=user, 
                customer_id=user_id, 
                business=customer_data.get('business'),
                description=customer_data.get('description'),
                industry=customer_data.get('industry'),
                city=customer_data.get('city'),
                state=customer_data.get('state'),
                country=customer_data.get('country')
            )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        print(user)
        if user and user.is_active:
            user_data = model_to_dict(user)
            return user_data
        raise serializers.ValidationError("Invalid credentials")
    
    def create(self, validated_data):
        user = self.validate(validated_data)
        refresh = RefreshToken.for_user(user) # type: ignore
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token), # type: ignore
            'user': UserSerializer(user).data,  # Serialize the user object
        }
