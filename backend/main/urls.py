'''
Created Date: Friday, July 26th 2024, 12:10:47 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.urls import path
from .views import (ProductList, ProductDetails, CartList, CartDetails, OrderList, OrderDetails, 
                    SubscribeList, SubscribeDetails, ReviewList, ReviewDetails)


urlpatterns = [
    path("products/", ProductList.as_view(), name="List Products"), # type: ignore
    path("product/<str:product_id>/", ProductDetails.as_view(), name="View Product"),
    path("subscriptions/", SubscribeList.as_view(), name="List Subscriptions"), # type: ignore
    path("subscription/<str:subscribe_id>/", SubscribeDetails.as_view(), name="View Subscription"),
    path("cart/", CartList.as_view(), name="List Cart"), # type: ignore
    path("cart/<str:cart_id>/", CartDetails.as_view(), name="View Product"),
    path("orders/", OrderList.as_view(), name="List Orders"), # type: ignore
    path("order/<str:order_id>/", OrderDetails.as_view(), name="View Order"),
    path("reviews/", ReviewList.as_view(), name="List Reviews"), # type: ignore
    path("review/<str:review_id>/", ReviewDetails.as_view(), name="View Review"),
]
