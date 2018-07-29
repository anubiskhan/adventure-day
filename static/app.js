function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    if (status == 'OK') {
      return results[0].geometry.location;
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function createAdventure() {
  var startAddress = document.getElementById('start-address-field').value;
  location.href = "https://www.google.com/maps/dir/?api=1&origin=39.8956,-104.9564&destination=39.7508,-104.9966&waypoints=periodic%20brewing|station26|fallingrock&travelmode=walking";
}
