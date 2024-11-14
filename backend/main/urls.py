'''
Created Date: Friday, July 26th 2024, 12:10:47 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.urls import path
from .views import (ProductList, ProductDetails, CartList, CartDetails, OrderList, OrderDetails, 
                    SubscribeList, SubscribeDetails, ReviewList, ReviewDetails, OwnerList,
                    OwnerDetails)


urlpatterns = [
    path("products/", ProductList.as_view(), name="List Products"), # type: ignore
    path("products/<str:product_id>/", ProductDetails.as_view(), name="View Product"),
    path("subscriptions/", SubscribeList.as_view(), name="List Subscriptions"), # type: ignore
    path("subscriptions/<str:subscribe_id>/", SubscribeDetails.as_view(), name="View Subscription"),
    path("owners/", OwnerList.as_view(), name="List Owners"), # type: ignore
    path("owners/<str:owner_id>/", OwnerDetails.as_view(), name="View Owners"),
    path("cart/", CartList.as_view(), name="List Cart"), # type: ignore
    path("cart/<str:cart_id>/", CartDetails.as_view(), name="View Cart"),
    path("orders/", OrderList.as_view(), name="List Orders"), # type: ignore
    path("orders/<str:order_id>/", OrderDetails.as_view(), name="View Order"),
    path("reviews/", ReviewList.as_view(), name="List Reviews"), # type: ignore
    path("reviews/<str:review_id>/", ReviewDetails.as_view(), name="View Review"),
]
