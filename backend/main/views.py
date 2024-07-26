'''
Created Date: Friday, July 26th 2024, 12:08:09 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework import generics
from .serializers import MarketerSerializer, MarketerDetailSerializer
from .models import Marketer


class MarketerList(generics.ListCreateAPIView):
    queryset = Marketer.objects.all()
    serializer_class = MarketerSerializer


class MarketerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Marketer.objects.all()
    serializer_class = MarketerDetailSerializer
