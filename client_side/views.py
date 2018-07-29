# from django.template import Template
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template import loader

def home(request):
    return render(request, 'adventure_day/home.html')
