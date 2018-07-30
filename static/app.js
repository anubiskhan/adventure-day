async function createAdventure() {
  let startAddressFormatted = await handleAddressField()
  let addressInformation = await fetch(`latlong/?address=${startAddressFormatted}`)
                          .then(response => {
                            return response.json();
                          })
  let originString = createOrigin(addressInformation.results[0].geometry.location);
  let placesList = await getPlaces(originString)
  let completeRoute = await getToWalking(placesList, originString)
}

function handleAddressField() {
  // let addressFieldTest = document.getElementById('start-address-field').value;
  if (document.getElementById('start-address-field').value == "") {
    return getCurrentLocation()
  } else {
    return document.getElementById('start-address-field').value.split(' ').join('+')
  }
  // var startAddressFormatted = startAddressRaw.split(' ').join('+')
}

function createOrigin(result) {
  return `${result.lat},${result.lng}`;
}

function getPlaces(origin) {
  var locationType = document.getElementById('location-type-selector').value;
  return fetch(`places/?origin=${origin}&type=${locationType}`)
  .then(response => {
    return response.json();
  })
}

function getToWalking(placesList, origin) {
  var placesArray = placesList.results
  var cap = placesArray.length
  var placeNames = [
    placesArray[Math.floor(Math.random() * cap)].name.split(' ').join('+'),
    placesArray[Math.floor(Math.random() * cap)].name.split(' ').join('+'),
    placesArray[Math.floor(Math.random() * cap)].name.split(' ').join('+')
  ]
  var placeIds = [
    placesArray[Math.floor(Math.random() * cap)].place_id,
    placesArray[Math.floor(Math.random() * cap)].place_id,
    placesArray[Math.floor(Math.random() * cap)].place_id
  ]
  var destination = origin
  // window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${placeNames[0]}|${placeNames[1]}|${placeNames[2]}&waypoint_place_ids=${placeIds[0]}|${placeIds[1]}|${placeIds[2]}&travelmode=walking`);
  location.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${placeNames[0]}|${placeNames[1]}|${placeNames[2]}&waypoint_place_ids=${placeIds[0]}|${placeIds[1]}|${placeIds[2]}&travelmode=walking`
}

async function getCurrentLocation() {
  let currentLatLong = await getCurrentLatLong()
  getAddress(currentLatLong)
}

function getCurrentLatLong() {
  return fetch('currentloc/')
  .then(response => {
    return response.json();
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
