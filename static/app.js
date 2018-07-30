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
  var cap = results.length
  var placeNames = [
    results[Math.floor(Math.random() * cap)].name.split(' ').join('+'),
    results[Math.floor(Math.random() * cap)].name.split(' ').join('+'),
    results[Math.floor(Math.random() * cap)].name.split(' ').join('+')
  ]
  var placeIds = [
    results[Math.floor(Math.random() * cap)].place_id,
    results[Math.floor(Math.random() * cap)].place_id,
    results[Math.floor(Math.random() * cap)].place_id
  ]
  var destination = origin
  location.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${placeNames[0]}|${placeNames[1]}|${placeNames[2]}&waypoint_place_ids=${placeIds[0]}|${placeIds[1]}|${placeIds[2]}&travelmode=walking`;
}

function getCurrentLocation() {
  fetch('currentloc/')
  .then(response => {
    console.log(response);
    return response.json();
  })
  .then(result => {
    console.log(result);
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
