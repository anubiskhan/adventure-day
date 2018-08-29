from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2
import requests
import json
from django.conf import settings
import urllib.parse
GOOGLE_MAPS_PLATFORM_API_KEY = settings.GOOGLE_MAPS_PLATFORM_API_KEY


def get_matrix(array, origin):
    names = name_parse(array)
    places = place_parse(array)
    ids = id_parse(array)
    lat_long_list = [origin, [names[0], ids[0]], [names[1], ids[1]], [names[2], ids[2]]]
    response = requests.get(f'https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}|{places[0]}|{places[1]}|{places[3]}&destinations={origin}|{places[0]}|{places[1]}|{place_3}&mode=walking&key={key}')
    returned_matrix = response.json()
    return shortest_route(returned_matrix, lat_long_list)

def get_random_order(array, origin):
    names = name_parse(array)
    ids = id_parse(array)
    lat_long_list = [origin, [names[0], ids[0]], [names[1], ids[1]], [names[2], ids[2]]]
    return lat_long_list

def create_distance_callback(dist_matrix):
    def distance_callback(from_node, to_node):
        return int(dist_matrix[from_node][to_node])
    return distance_callback

def shortest_route(matrix, lat_long_list):
    place_lat_long = lat_long_list
    dist_matrix = []
    for x in range(0, 4):
        sub_dist_matrix = []
        for y in range(0, 4):
            sub_dist_matrix.append(matrix['rows'][x]['elements'][y]['distance']['value'])
        dist_matrix.append(sub_dist_matrix)
    import pdb; pdb.set_trace()

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

def name_parse(array):
    names_list = []
    for i in range(len(array)):
        names_list.append(urllib.parse.quote(array[i]['name']))
    return names_list

def id_parse(array):
    ids_list = []
    for i in range(len(array)):
        ids_list.append(array[i]['place_id'])
    return ids_list

def place_parse(array):
    places_list = []
    for i in range(len(array)):
        lat = array[i]['geometry']['location']['lat']
        lng = array[i]['geometry']['location']['lng']
        places_list.append(f'{lat},{lng}')
    return places_list
