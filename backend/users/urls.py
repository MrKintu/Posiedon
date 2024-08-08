'''
Created Date: Saturday, July 27th 2024, 2:02:18 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.urls import path
from .views import (LoginView, RegisterView, LogoutView, TestJWTView, MarketerList, MarketerDetails,
                    CustomerList, CustomerDetails, UserInfoList, UserInfoDetails)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('test-token/', TestJWTView.as_view(), name='test_jwt'),
    path("user-info/", UserInfoList.as_view(), name="List User-Info"), # type: ignore
    path("user-info/<int:phone>/", UserInfoDetails.as_view(), name="View User-Info"),
    path("marketers/", MarketerList.as_view(), name="List Marketers"), # type: ignore
    path("marketer/<str:staff_id>/", MarketerDetails.as_view(), name="View Marketer"),
    path("customers/", CustomerList.as_view(), name="List Customer"), # type: ignore
    path("customer/<str:customer_id>/", CustomerDetails.as_view(), name="View Customer"),
]
