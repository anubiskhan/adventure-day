# from django.template import Template
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template import loader
import requests
from django.conf import settings

GOOGLE_MAPS_PLATFORM_API_KEY = settings.GOOGLE_MAPS_PLATFORM_API_KEY

def home(request):
    return render(request, 'adventure_day/home.html')

def places(request):
    origin = request.META['QUERY_STRING'].split('&')[0].split('=')[1]
    type = request.META['QUERY_STRING'].split('&')[1].split('=')[1].lower()
    places = requests.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={origin}&radius=1609&type={type}&key=AIzaSyC_n7L6BbBnoCl6BxJcj3qSo_jurQLueCE'.format(origin=origin, type=type))
    return HttpResponse(places)

def latlong(request):
    address = request.META['QUERY_STRING'].split('=')[1]
    latlong = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={key}'.format(address=address, key=GOOGLE_MAPS_PLATFORM_API_KEY))
    return HttpResponse(latlong)
