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
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Customer, Staff
from .serializers import (UserSerializer, LoginSerializer, CustomerDetailSerializer, CustomerSerializer,
                          StaffSerializer, StaffDetailSerializer)


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
class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            response_data = serializer.create(serializer.validated_data)
            return Response(response_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response(
                {"detail": str(e.detail[0]) if isinstance(e.detail, list) else str(e.detail)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": "An error occurred during login."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Logout User
class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Blacklist the refresh token
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
