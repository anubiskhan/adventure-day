from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2
import requests
import json
from django.conf import settings
import urllib.parse
GOOGLE_MAPS_PLATFORM_API_KEY = settings.GOOGLE_MAPS_PLATFORM_API_KEY


def get_matrix(array, origin):
    place_name_1 = urllib.parse.quote(array[0]['name'])
    place_name_2 = urllib.parse.quote(array[1]['name'])
    place_name_3 = urllib.parse.quote(array[2]['name'])
    place_1 = '{lat},{lng}'.format(lat=array[0]['geometry']['location']['lat'], lng=array[0]['geometry']['location']['lng'])
    place_2 = '{lat},{lng}'.format(lat=array[1]['geometry']['location']['lat'], lng=array[1]['geometry']['location']['lng'])
    place_3 = '{lat},{lng}'.format(lat=array[2]['geometry']['location']['lat'], lng=array[2]['geometry']['location']['lng'])
    place_id_1 = array[0]['place_id']
    place_id_2 = array[1]['place_id']
    place_id_3 = array[2]['place_id']
    lat_long_list = [origin, [place_name_1, place_id_1], [place_name_2, place_id_2], [place_name_3, place_id_3]]
    response = requests.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}|{place_1}|{place_2}|{place_3}&destinations={origin}|{place_1}|{place_2}|{place_3}&mode=walking&key={key}'.format(origin=origin, place_1=place_1, place_2=place_2, place_3=place_3, key=GOOGLE_MAPS_PLATFORM_API_KEY))
    returned_matrix = response.json()
    return shortest_route(returned_matrix, lat_long_list)

def get_random_order(array, origin):
    place_name_1 = urllib.parse.quote(array[0]['name'])
    place_name_2 = urllib.parse.quote(array[1]['name'])
    place_name_3 = urllib.parse.quote(array[2]['name'])
    # place_1 = '{lat},{lng}'.format(lat=array[0]['geometry']['location']['lat'], lng=array[0]['geometry']['location']['lng'])
    # place_2 = '{lat},{lng}'.format(lat=array[1]['geometry']['location']['lat'], lng=array[1]['geometry']['location']['lng'])
    # place_3 = '{lat},{lng}'.format(lat=array[2]['geometry']['location']['lat'], lng=array[2]['geometry']['location']['lng'])
    place_id_1 = array[0]['place_id']
    place_id_2 = array[1]['place_id']
    place_id_3 = array[2]['place_id']
    # lat_long_list = [origin, place_1 + ' ' + place_id_1, place_2 + ' ' + place_id_2, place_3 + ' ' + place_id_3]
    lat_long_list = [origin, [place_name_1, place_id_1], [place_name_2, place_id_2], [place_name_3, place_id_3]]

    return lat_long_list

def create_distance_callback(dist_matrix):
    def distance_callback(from_node, to_node):
        return int(dist_matrix[from_node][to_node])
    return distance_callback

def shortest_route(matrix, lat_long_list):
    place_lat_long = lat_long_list
    dist_matrix = [
        [
        matrix['rows'][0]['elements'][0]['distance']['value'],
        matrix['rows'][0]['elements'][1]['distance']['value'],
        matrix['rows'][0]['elements'][2]['distance']['value'],
        matrix['rows'][0]['elements'][3]['distance']['value']
        ],
        [
        matrix['rows'][1]['elements'][0]['distance']['value'],
        matrix['rows'][1]['elements'][1]['distance']['value'],
        matrix['rows'][1]['elements'][2]['distance']['value'],
        matrix['rows'][1]['elements'][3]['distance']['value']
        ],
        [
        matrix['rows'][2]['elements'][0]['distance']['value'],
        matrix['rows'][2]['elements'][1]['distance']['value'],
        matrix['rows'][2]['elements'][2]['distance']['value'],
        matrix['rows'][2]['elements'][3]['distance']['value']
        ],
        [
        matrix['rows'][3]['elements'][0]['distance']['value'],
        matrix['rows'][3]['elements'][1]['distance']['value'],
        matrix['rows'][3]['elements'][2]['distance']['value'],
        matrix['rows'][3]['elements'][3]['distance']['value']
        ]
    ]

    tsp_size = len(place_lat_long)
    num_routes = 1
    depot = 0
    # Create routing model
    if tsp_size > 0:
        routing = pywrapcp.RoutingModel(tsp_size, num_routes, depot)
        search_parameters = pywrapcp.RoutingModel.DefaultSearchParameters()
        # Create the distance callback.
        dist_callback = create_distance_callback(dist_matrix)
        routing.SetArcCostEvaluatorOfAllVehicles(dist_callback)
        # Solve the problem.
        assignment = routing.SolveWithParameters(search_parameters)
        if assignment:
            route_number = 0
            index = routing.Start(route_number) # Index of the variable for the starting node.
            route = []
            while not routing.IsEnd(index):
                # Convert variable indices to node indices in the displayed route.
                route.append(place_lat_long[routing.IndexToNode(index)])
                index = assignment.Value(routing.NextVar(index))
            return route
