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
  // data = {origin: origin}
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
  var destination = origin
  location.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${places[0]}|${places[1]}|${places[2]}&travelmode=walking`;
}

function getCurrentLocation() {
  $.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_PLATFORM_API_KEY}`)
  .then(response => {
    $("#start-address-field").val(`${response.location.lat.toFixed(5)},${response.location.lng.toFixed(5)}`)
  })
}
