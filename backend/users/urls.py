'''
Created Date: Saturday, July 27th 2024, 2:02:18 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.urls import path
from .views import (LoginView, RegisterView, LogoutView, TestJWTView, StaffList, StaffDetails,
                    CustomerList, CustomerDetails)


urlpatterns = [
    path('sign-up/', RegisterView.as_view(), name='register'),
    path('sign-in/', LoginView.as_view(), name='login'),
    path('sign-out/', LogoutView.as_view(), name='logout'),
    path('test-token/', TestJWTView.as_view(), name='test_jwt'),
    path("staff/", StaffList.as_view(), name="List Staffs"), # type: ignore
    path("staff/<str:staff_id>/", StaffDetails.as_view(), name="View Staff"),
    path("customers/", CustomerList.as_view(), name="List Customer"), # type: ignore
    path("customers/<str:customer_id>/", CustomerDetails.as_view(), name="View Customer"),
]
