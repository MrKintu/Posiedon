'''
Created Date: Wednesday, August 7th 2024, 12:00:08 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

import secrets
import string
import logging
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Staff, Customer


logger = logging.getLogger(__name__)

# Generate User ID
def new_ID(is_staff: bool) -> str:
    alphabet = string.ascii_uppercase + string.digits
    secure_string = ''.join(secrets.choice(alphabet) for _ in range(6))
    return f'STF-{secure_string}' if is_staff else f'CUS-{secure_string}'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'business', 'years', 'phone', 'description', 'industry', 'city', 
                  'state', 'country']


class CustomerDetailSerializer(serializers.ModelSerializer):
    owner_customer = serializers.StringRelatedField(many=True)
    cart_customer = serializers.StringRelatedField(many=True)
    order_customer = serializers.StringRelatedField(many=True)
    review_customer = serializers.StringRelatedField(many=True)
    staff_customers = serializers.StringRelatedField(many=True)

    class Meta:
        model = Customer
        fields = "__all__"
        depth = 1


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ['staff_id', 'division', 'phone', 'profile_image', 'customers', 'is_admin']


class StaffDetailSerializer(serializers.ModelSerializer):
    product_staff = serializers.StringRelatedField(many=True)

    class Meta:
        model = Staff
        fields = "__all__"
        depth = 1 


class UserSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(required=True)

    class Meta:
        model = User
        fields = ['id', 'password', 'email', 'first_name', 'last_name', 'is_staff', 'customer']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        email = validated_data.get('email')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            logger.warning("Attempted to create a user with an existing email: %s", email)
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        logger.debug("Validated data: %s", validated_data)
        customer_data = validated_data.pop('customer')
        
        is_staff = validated_data.get('is_staff')
        user_id = new_ID(is_staff)
        logger.debug("Creating user with user_id: %s", user_id)
        
        # Create user
        user = User.objects.create_user(
            username=user_id,
            email=email,
            password=validated_data.get('password'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            is_staff=is_staff
        )
        logger.info("User created: %s", user)

        if is_staff:
            # Create staff and associate customers if provided
            logger.debug("Creating staff for user: %s", user)
            staff = Staff.objects.create(
                user=user,
                staff_id=user_id,
                profile_image=validated_data.get('profile_image'),
                division=validated_data.get('division'),
                phone=validated_data.get('phone'),
                is_admin=validated_data.get('is_admin')
            )
            logger.info("Staff created: %s", staff)

            if 'customers' in validated_data:
                for single in validated_data.get('customers'):
                    customer = get_object_or_404(Customer, customer_id=single)
                    staff.customers.add(customer)
                    logger.info("Customer added to staff: %s", customer)
        else:
            # Create customer
            logger.debug("Creating customer for user: %s", user)
            customer = Customer.objects.create(
                user=user,
                customer_id=user_id,
                **customer_data
            )
            logger.info("Customer created: %s", customer)

        logger.debug("Returning user: %s", user)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        logger.info("Validating login credentials.")
        
        # Retrieve the user by email
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            logger.warning("Login attempt with non-existing email: %s", data['email'])
            raise serializers.ValidationError("Invalid email or password")
        
        # Authenticate with the retrieved username and provided password
        user = authenticate(username=user.username, password=data['password'])
        
        if user and user.is_active:
            logger.info("User %s authenticated successfully.", user.username)
            self.context['user'] = user  # Storing user in the context for token generation
            return model_to_dict(user)
        
        logger.warning("Invalid login attempt with email: %s", data['email'])
        raise serializers.ValidationError("Invalid email or password")

    def create(self, validated_data):
        logger.info("Creating JWT tokens for user.")

        # Retrieve the authenticated user from context
        user = self.context['user']
        refresh = RefreshToken.for_user(user)
        
        logger.info("Tokens generated for user: %s", user.username)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token), # type: ignore
            'user': UserSerializer(user).data,
        }
    