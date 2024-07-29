'''
Created Date: Saturday, July 27th 2024, 2:01:02 am
Author: Kintu Declan Trevor

Copyright (c) 2024 Kintu Declan Trevor
'''

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse


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


def logout_view(request):
    logout(request)
    response = True

    return HttpResponse(response)
