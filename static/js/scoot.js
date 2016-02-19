var mapElem = document.getElementById('map');
var windowHeight = window.innerHeight - 60;
mapElem.style.height = windowHeight + 'px';
var map;
function initMap() {
    console.log('initializing map');
    map = new google.maps.Map(mapElem, {
        center: {lat: 37.765266, lng: -122.443355},
        zoom: 14
    });

    var request = new XMLHttpRequest();
    request.open('GET', '/api/scooters', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var resp = request.responseText;
            var scooters = JSON.parse(resp);
            scooters.forEach(function(scooter) {
                var location = {lat: parseFloat(scooter.latitude), lng: parseFloat(scooter.longitude)};
                new google.maps.Marker({
                    position: location,
                    map: map,
                    title: String(scooter.physical_scoot_id)
                });
            });
        } else {
            // We reached our target server, but it returned an error
           console.log('error fetching scooters')
        }
    };

    request.onerror = function(e) {
        // There was a connection error of some sort
        console.log(e);
    };

    request.send();


}




