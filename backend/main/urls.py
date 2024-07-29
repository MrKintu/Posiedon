'''
Created Date: Friday, July 26th 2024, 12:10:47 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.urls import path
from .views import (ProductList, ProductDetails, MarketerList, MarketerDetails, 
                    CustomerList, CustomerDetails)


urlpatterns = [
    path("list-products/", ProductList.as_view(), name="List Products"), # type: ignore
    path("view-product/<int:pk>/", ProductDetails.as_view(), name="View Product"),
    path("list-marketers/", MarketerList.as_view(), name="List Marketers"), # type: ignore
    path("view-marketer/<int:pk>/", MarketerDetails.as_view(), name="View Marketer"),
    path("list-customers/", CustomerList.as_view(), name="List Customer"), # type: ignore
    path("view-customer/<int:pk>/", CustomerDetails.as_view(), name="View Customer"),
]
