function createAdventure() {
  var startAddressRaw = document.getElementById('start-address-field').value;
  var startAddressFormatted = startAddressRaw.split(' ').join('+')
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${startAddressFormatted}&key=AIzaSyC_n7L6BbBnoCl6BxJcj3qSo_jurQLueCE`)
                          .then(response => {
                            return response.json();
                          })
                          .then(result => {
                            geocodeAddress(result.results[0].geometry.location);
                          });
}

function geocodeAddress(result) {
  var origin = `${result.lat},${result.lng}`;
  var destination = "39.7508,-104.9966"
  location.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=periodic%20brewing|station26|fallingrock&travelmode=walking`;
}
