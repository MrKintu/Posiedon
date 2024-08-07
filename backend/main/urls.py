'''
Created Date: Friday, July 26th 2024, 12:10:47 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.urls import path
from .views import (ProductList, ProductDetails, MarketerList, MarketerDetails, CartList, CartDetails, 
                    OrderList, OrderDetails, CustomerList, CustomerDetails, SubscribeList, 
                    SubscribeDetails)


urlpatterns = [
    path("products/", ProductList.as_view(), name="List Products"), # type: ignore
    path("product/<str:product_id>/", ProductDetails.as_view(), name="View Product"),
    path("subscriptions/", SubscribeList.as_view(), name="List Subscriptions"), # type: ignore
    path("subscription/<str:subscribe_id>/", SubscribeDetails.as_view(), name="View Subscription"),
    path("cart/", CartList.as_view(), name="List Cart"), # type: ignore
    path("cart/<str:cart_id>/", CartDetails.as_view(), name="View Product"),
    path("orders/", OrderList.as_view(), name="List Orders"), # type: ignore
    path("order/<str:order_id>/", OrderDetails.as_view(), name="View Order"),
    path("marketers/", MarketerList.as_view(), name="List Marketers"), # type: ignore
    path("marketer/<str:staff_id>/", MarketerDetails.as_view(), name="View Marketer"),
    path("customers/", CustomerList.as_view(), name="List Customer"), # type: ignore
    path("customer/<str:customer_id>/", CustomerDetails.as_view(), name="View Customer"),
]
