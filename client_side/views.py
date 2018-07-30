# from django.template import Template
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template import loader
import requests

def home(request):
    return render(request, 'adventure_day/home.html')

def places(request):
    origin = request.META['QUERY_STRING']
    places = requests.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={origin}&radius=1609&type=park&key=AIzaSyC_n7L6BbBnoCl6BxJcj3qSo_jurQLueCE'.format(origin=origin))
    return HttpResponse(places)
