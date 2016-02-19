var mapElem = document.getElementById('map');
var windowHeight = window.innerHeight - 60;
mapElem.style.height = windowHeight + 'px';
var map;
var timeIndex = 0;
var markers = [];

function initMap() {
    console.log('initializing map');
    map = new google.maps.Map(mapElem, {
        center: {lat: 37.765266, lng: -122.443355},
        zoom: 14
    });


    getScooters(timeIndex)
}

function getScooters(timeIndex) {
    var request = new XMLHttpRequest();
    var url = '/api/scooters/' + timeIndex;
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var resp = request.responseText;
            var response = JSON.parse(resp);
            var scooters = response.scooters;
            var timestamp = response.timestamp;
            var localTime = new Date(timestamp * 1000);
            var timestampLabel = document.getElementById('timestamp');
            var prettyDate = moment(localTime).format('MMMM Do YYYY, h:mm:ss a');
            timestampLabel.innerHTML = prettyDate;
            var chargeLabel = document.getElementById('charge');
            var averageCharge = getAverageCharge(scooters);
            chargeLabel.innerHTML = averageCharge.toFixed(2) + '%';
            var availableLabel = document.getElementById('available');
            availableLabel.innerHTML = scooters.length;

            clearMarkers(markers);
            scooters.forEach(function(scooter) {
                var location = {lat: parseFloat(scooter.latitude), lng: parseFloat(scooter.longitude)};
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: String(scooter.physical_scoot_id)
                });
                markers.push(marker);
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

var nextButton = document.getElementById('next');
nextButton.addEventListener('click', function() {
    console.log('loading next time');
    timeIndex++;
    getScooters(timeIndex);
});

var prevButton = document.getElementById('previous');
prevButton.addEventListener('click', function() {
    timeIndex--;
    getScooters(timeIndex);
});

function clearMarkers() {
    markers.forEach(function(marker){
        marker.setMap(null);
    });
    markers = [];
}

function getAverageCharge(scooters) {
    var totalCharge = 0;
    scooters.forEach(function(scooter) {
        totalCharge += parseFloat(scooter.batt_pct_smoothed);
    });
    return totalCharge / scooters.length;
}




