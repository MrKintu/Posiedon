'''
Created Date: Friday, July 26th 2024, 1:14:56 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from rest_framework import serializers
from .models import Marketer


class MarketerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketer
        exclude = ["user", "customer"]
    
    def __init__(self, *args, **kwargs):
        super(MarketerSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore


class MarketerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketer
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(MarketerDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1 # type: ignore
