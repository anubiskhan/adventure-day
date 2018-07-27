params = dict(
  base_url = 'https://www.google.com/maps/dir/?api=1'
  origin='39.8956,-104.9564',
  destination='39.7508,-104.9966',
  waypoints='brewery'
)
adventure_route = '{base_url}&origin={origin}&destination={destination}&waypoints={waypoints}'.format(base_url=params['base_url'], origin=params['origin'], destination=params['destination'], waypoints=params['waypoints'])

adventure_route
