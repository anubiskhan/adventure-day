# from django.template import Template
from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template import loader
import requests
import random
import json
from django.conf import settings
# from . import shortest_route_service
from .shortest_route_service import *

GOOGLE_MAPS_PLATFORM_API_KEY = settings.GOOGLE_MAPS_PLATFORM_API_KEY

def home(request):
    return render(request, 'adventure_day/home.html')

def latlong(request):
    address = request.META['QUERY_STRING'].split('=')[1]
    latlong = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={key}'.format(address=address, key=GOOGLE_MAPS_PLATFORM_API_KEY))
    return HttpResponse(latlong)

def currentloc(request):
    cur_location = requests.post('https://www.googleapis.com/geolocation/v1/geolocate?key={key}'.format(key=GOOGLE_MAPS_PLATFORM_API_KEY))
    return HttpResponse(cur_location)

def places(request):
    origin = request.META['QUERY_STRING'].split('&')[0].split('=')[1]
    type = request.META['QUERY_STRING'].split('&')[1].split('=')[1].lower()
    radius = request.META['QUERY_STRING'].split('&')[2].split('=')[1]
    search_type = request.META['QUERY_STRING'].split('&')[3].split('=')[1]
    places = requests.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={origin}&radius={radius}&type={type}&key={key}'.format(origin=origin, radius=radius, type=type, key=GOOGLE_MAPS_PLATFORM_API_KEY))
    places_list = places.json()['results']
    if len(places_list) < 3:
        return HttpResponse(json.dumps('Not enough places'))
    random.shuffle(places_list)
    if search_type == 'optimized':
        ordered_places = get_matrix(places_list[:3], origin)
    else:
        ordered_places = get_random_order(places_list[:3], origin)
    return HttpResponse(json.dumps(ordered_places))
