function createAdventure() {
  var startAddressRaw = document.getElementById('start-address-field').value;
  var startAddressFormatted = startAddressRaw.split(' ').join('+')
  fetch(`latlong/?address=${startAddressFormatted}`)
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
  var locationType = document.getElementById('location-type-selector').value;
  fetch(`places/?origin=${origin}&type=${locationType}`)
  .then(response => {
    return response.json();
  })
  .then(result => {
    getToWalking(result.results, origin);
  });
}

function getToWalking(results, origin) {
  var places = [results[Math.floor(Math.random() * 20)].name.split(' ').join('+'),
                results[Math.floor(Math.random() * 20)].name.split(' ').join('+'),
                results[Math.floor(Math.random() * 20)].name.split(' ').join('+')]
  var destination = origin
  location.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${places[0]}|${places[1]}|${places[2]}&travelmode=walking`;
}

function getCurrentLocation() {
  fetch('currentloc/')
  .then(response => {
    return response.json();
  })
  .then(result => {
    getAddress(result)
  })
}

function getAddress(result) {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.location.lat.toFixed(5)},${result.location.lng.toFixed(5)}`)
  .then(response => {
    return response.json();
  })
  .then(result => {
    $("#start-address-field").val(`${result.results[0].formatted_address}`)
  })
}
