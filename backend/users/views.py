'''
Created Date: Saturday, July 27th 2024, 2:01:02 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

import logging
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Customer, Staff
from .serializers import (UserSerializer, LoginSerializer, CustomerDetailSerializer, CustomerSerializer,
                          StaffSerializer, StaffDetailSerializer)


_logger = logging.getLogger(__name__)

# Create New User
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        _logger.info("New user created: %s", serializer.data['email'])
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# Login User
class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            response_data = serializer.create(serializer.validated_data)
            _logger.info("Login successful for user: %s", response_data['user']['email'])
            return Response(response_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            response = Response(
                {"detail": str(e.detail[0]) if isinstance(e.detail, list) else str(e.detail)},
                status=status.HTTP_400_BAD_REQUEST
            )
            _logger.warning("Login failed for user: %s", request.data.get('email', 'unknown'))
            _logger.warning(response.data)
            return response
        except Exception as e:
            response = Response(
                {"detail": "An error occurred during login."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            _logger.error("Login failed for user: %s", request.data.get('email', 'unknown'))
            _logger.error(str(e))
            return response


# Logout User
class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # Get the refresh token from either the request body or the Authorization header
            refresh_token = request.data.get('refresh_token')
            
            # If no refresh token is provided, just return success
            # Frontend will remove the tokens anyway
            if not refresh_token:
                response = Response(
                    {"message": "Successfully logged out."}, 
                    status=status.HTTP_200_OK
                )
                _logger.info("Logout successful for user: %s", request.user.username)
                _logger.info(response.data)
                return response
            
            # If refresh token is provided, blacklist it
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as token_error:
                # If there's an error with the token, log it but still consider it a successful logout
                _logger.warning(f"Error blacklisting token: {str(token_error)}")
                
            response = Response(
                {"message": "Successfully logged out."}, 
                status=status.HTTP_200_OK
            )
            _logger.info("Logout successful for user: %s", request.user.username)
            _logger.info(response.data)
            return response
        except Exception as e:
            _logger.error(f"Logout error: {str(e)}")
            response = Response(
                {"error": "An error occurred during logout."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            _logger.error(response.data)
            return response


# Fetch all Customers
class CustomerList(generics.ListAPIView):
    queryset = Customer.objects.all().order_by('customer_id')
    serializer_class = CustomerSerializer
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]


# Fetch Single Customer
class CustomerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerDetailSerializer
    lookup_field = 'customer_id'
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]


# Fetch all Staffs
class StaffList(generics.ListAPIView):
    queryset = Staff.objects.all().order_by('staff_id')
    serializer_class = StaffSerializer
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]


# Fetch Single Staff
class StaffDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Staff.objects.all()
    serializer_class = StaffDetailSerializer
    lookup_field = 'staff_id'
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

# Test JWT
class TestJWTView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Token is valid!"})
