'''
Created Date: Friday, July 26th 2024, 12:10:47 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.urls import path
from .views import MarketerList, MarketerDetails


urlpatterns = [
    path("marketers/", MarketerList.as_view(), name="Marketer List"), # type: ignore
    path("view-marketer/<int:pk>/", MarketerDetails.as_view(), name="View Marketer")
]
