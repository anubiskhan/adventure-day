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

function createOrigin(result) {
  return `${result.lat},${result.lng}`;
}

function getPlaces(origin) {
  var locationType = document.getElementById('location-type-selector').value;
  var searchRadius = document.getElementById('radius-selector').value;
  return fetch(`places/?origin=${origin}&type=${locationType}&radius=${searchRadius}`)
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

async function handleAddressField() {
  if (document.getElementById('start-address-field').value == "") {
    return await getCurrentLocation()
  } else {
    return document.getElementById('start-address-field').value.split(' ').join('+')
  }
};

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      getAddress(pos);
    })
  }
}

function getAddress(result) {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.lat.toFixed(5)},${result.lng.toFixed(5)}`)
  .then(response => {
    return response.json();
  })
  .then(result => {
    $("#start-address-field").val(`${result.results[0].formatted_address}`)
  })
}
