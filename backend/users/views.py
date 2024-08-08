'''
Created Date: Saturday, July 27th 2024, 2:01:02 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Customer, Marketer, UserInfo
from .serializers import (UserSerializer, LoginSerializer, CustomerDetailSerializer, CustomerSerializer,
                          MarketerSerializer, MarketerDetailSerializer, UserInfoSerializer,
                          UserInfoDetailSerializer)


# Create New User
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# Login User
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


# Logout User
class LogoutView(APIView):
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, Token.DoesNotExist):
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


# Fetch all UserInfo
class UserInfoList(generics.ListCreateAPIView):
    queryset = UserInfo.objects.all().order_by('phone')
    serializer_class = UserInfoSerializer
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]


# Fetch Single UserInfo
class UserInfoDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoDetailSerializer
    lookup_field = 'phone'
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]


# Fetch all Customers
class CustomerList(generics.ListCreateAPIView):
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


# Fetch all Marketers
class MarketerList(generics.ListCreateAPIView):
    queryset = Marketer.objects.all().order_by('staff_id')
    serializer_class = MarketerSerializer
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]


# Fetch Single Marketer
class MarketerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Marketer.objects.all()
    serializer_class = MarketerDetailSerializer
    lookup_field = 'staff_id'
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

# Test JWT
class TestJWTView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Token is valid!"})
