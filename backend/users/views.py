'''
Created Date: Saturday, July 27th 2024, 2:01:02 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

import secrets
import string
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Customer, Marketer, UserInfo


# Create User Ids
def new_ID(switch):
    alphabet = string.ascii_lowercase + string.digits
    secure_string = ''.join(secrets.choice(alphabet) for _ in range(6))
    if switch:
        new_id = f'cus-{secure_string}'
    else:
        new_id = f'stf-{secure_string}'

    return new_id


# Create new Customer
def new_customer(request):
    response = False
    if request.method == "POST":
        data = request.POST

        user_id = new_ID(True)
        user = User.objects.create_user(
            username=user_id,
            password=data["password"],
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"]
        )
        user.save()

        user_state = User.objects.get(username=user_id)
        user_info = UserInfo.objects.create(
            user = user_state,
            title = data["title"],
            gender = data["gender"],
            d_o_b = data["d_o_b"],
            phone = data["phone"],
            is_customer = True,
            is_staff = False
        )
        user_info.save()

        customer = Customer.objects.create(
            user=user_state,
            customer_id = user_id,
            subscribed = False
        )
        customer.save()

        true_user = User.objects.filter(username=user_id).exists()
        true_info = UserInfo.objects.filter(user=user_state).exists()
        true_customer = Customer.objects.filter(user=user_state).exists()
        if true_user and true_info and true_customer:
            response = True
    
    return HttpResponse(response)


# Create new Staff
def new_staff(request):
    response = False
    if request.method == "POST":
        data = request.POST

        user_id = new_ID(False)
        user = User.objects.create_user(
            username=user_id,
            password=data["password"],
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"]
        )
        user.save()

        user_state = User.objects.get(username=user_id)
        user_info = UserInfo.objects.create(
            user = user_state,
            title = data["title"],
            gender = data["gender"],
            d_o_b = data["d_o_b"],
            phone = data["phone"],
            is_customer = True,
            is_staff = False
        )
        user_info.save()

        staff = Marketer.objects.create(
            user=user_state,
            staff_id = user_id,
            subscribed = False,
            profile_image = data["image"]
        )
        staff.save()

        true_user = User.objects.filter(username=user_id).exists()
        true_info = UserInfo.objects.filter(user=user_state).exists()
        true_staff = Marketer.objects.filter(user=user_state).exists()
        if true_user and true_info and true_staff:
            response = True
    
    return HttpResponse(response)


# Login User
def login_view(request):
    response = False
    if request.method == "POST":
        data = request.POST
        username = data["username"]
        password = data["password"]

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            response = True
        else:
            response = False

    return HttpResponse(response)


# Logout User
def logout_view(request):
    logout(request)
    response = True

    return HttpResponse(response)
