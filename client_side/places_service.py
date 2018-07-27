import json, requests

url = 'https://api.foursquare.com/v2/venues/explore'

params = dict(
  client_id='FOURSQUARE_CLIENT_ID',
  client_secret='FOURSQUARE_CLIENT_SECRET',
  v='20180323',
  ll='39.8956,-104.9564',
  query='brewery',
  limit=1
)
resp = requests.get(url=url, params=params)
data = json.loads(resp.text)
