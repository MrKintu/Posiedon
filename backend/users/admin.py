'''
Created Date: Saturday, July 27th 2024, 2:01:02 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.contrib import admin
from .models import Customer, Marketer


admin.site.register(Customer)
admin.site.register(Marketer)
