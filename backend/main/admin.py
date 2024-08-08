'''
Created Date: Friday, July 26th 2024, 12:08:09 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.contrib import admin
from .models import Product, Subscribe, Cart, Order, Review


admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Subscribe)
