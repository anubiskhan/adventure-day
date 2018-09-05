async function createAdventure(searchType) {
  let startAddressFormatted = await handleAddressField()
  let addressInformation = await fetch(`latlong/?address=${startAddressFormatted}`)
                          .then(response => {
                            return response.json();
                          })
  let originString = createOrigin(addressInformation.results[0].geometry.location);
  let placesList = await getPlaces(originString, searchType)
  if (placesList == 'Not enough places') {
    alert("I'm sorry, there aren't enough locations nearby. Try increasing the search radius or changing the location type!");
  } else {
    let completeRoute = await getToWalking(placesList)
  }
}

function createOrigin(result) {
  return `${result.lat},${result.lng}`;
}

function getPlaces(origin, searchType) {
  var locationType = document.getElementById('location-type-selector').value;
  var locationNumber = document.getElementById('location-number-selector').value;
  var searchRadius = document.getElementById('radius-selector').value;
  return fetch(`places/?origin=${origin}&type=${locationType}&radius=${searchRadius}&search=${searchType}&number=${locationNumber}`)
  .then(response => {
    return response.json();
  })
}

function getToWalking(placesList) {
  let placeName1 = placesList[1][0]
  let placeName2 = placesList[2][0]
  let placeName3 = placesList[3][0]
  let placeId1 = placesList[1][1]
  let placeId2 = placesList[2][1]
  let placeId3 = placesList[3][1]
  // window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${placeNames[0]}|${placeNames[1]}|${placeNames[2]}&waypoint_place_ids=${placeIds[0]}|${placeIds[1]}|${placeIds[2]}&travelmode=walking`);
  finalRoute = `https://www.google.com/maps/dir/?api=1&origin=${placesList[0]}&destination=${placesList[0]}&waypoints=${placeName1}|${placeName2}|${placeName3}&waypoint_place_id:${placeId1}|${placeId2}|${placeId3}&travelmode=walking`
  location.href = finalRoute
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
