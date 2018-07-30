var GOOGLE_MAPS_PLATFORM_API_KEY = 'AIzaSyC_n7L6BbBnoCl6BxJcj3qSo_jurQLueCE'
function createAdventure() {
  var startAddressRaw = document.getElementById('start-address-field').value;
  var startAddressFormatted = startAddressRaw.split(' ').join('+')
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${startAddressFormatted}&key=${GOOGLE_MAPS_PLATFORM_API_KEY}`)
                          .then(response => {
                            return response.json();
                          })
                          .then(result => {
                            createOrigin(result.results[0].geometry.location);
                          });
}

function createOrigin(result) {
  var origin = `${result.lat},${result.lng}`;
  getPlaces(origin);
}

function getPlaces(origin) {
  data = {origin: origin}
  fetch(`places/?${origin}`)
  .then(response => {
    return response.json();
  })
  .then(result => {
    getToWalking(result.results, origin);
  });
}

function getToWalking(results, origin) {
  var places = [results[Math.floor(Math.random() * 20)].name.split(' ').join('+'), results[Math.floor(Math.random() * 20)].name.split(' ').join('+'), results[Math.floor(Math.random() * 20)].name.split(' ').join('+')]
  var destination = "39.7508,-104.9966"
  location.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${places[0]}|${places[1]}|${places[2]}&travelmode=walking`;
}
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=39.7508,-104.9966&radius=1609&type=park&key=AIzaSyC_n7L6BbBnoCl6BxJcj3qSo_jurQLueCE
// results[1].name
