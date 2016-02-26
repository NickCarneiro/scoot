var mapElem = document.getElementById('map');
var windowHeight = window.innerHeight - 60;
mapElem.style.height = windowHeight + 'px';
var map;
var timeIndex = 0;
// persistent map of scooters
var scooters = {};
// holds all the data precomputed on the server
var timeSeriesData;

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
    var url = '/api/scooters';
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var resp = request.responseText;
            var response = JSON.parse(resp);
            timeSeriesData = response;
            renderSnapshot(timeIndex);

        } else {
            // We reached our target server, but it returned an error
            console.log('error fetching scooter data')
        }
    };

    request.onerror = function(e) {
        // There was a connection error of some sort
        console.log(e);
    };

    request.send();
}

function renderSnapshot(timeIndex) {
    var serverScooters = timeSeriesData[timeIndex]['scooters'];
    var timestamp = timeSeriesData[timeIndex]['timestamp'];
    var localTime = new Date(timestamp * 1000);
    var timestampLabel = document.getElementById('timestamp');
    var prettyDate = moment(localTime).format('MMMM Do YYYY, h:mm:ss a');
    timestampLabel.innerHTML = prettyDate;
    var chargeLabel = document.getElementById('charge');
    var averageCharge = timeSeriesData[timeIndex]['average_charge_percentage'];
    chargeLabel.innerHTML = averageCharge.toFixed(2) + '%';
    var availableLabel = document.getElementById('available');
    var scootsAvailable = timeSeriesData[timeIndex]['total_scooters_available'];
    availableLabel.innerHTML = scootsAvailable;
    var scootilizationPercentage = timeSeriesData[timeIndex]['scootilization_percentage'];
    var scootilizationLabel = document.getElementById('scootilization');
    scootilizationLabel.innerHTML = scootilizationPercentage.toFixed(2) + '%';
    updateScooters(serverScooters);
}

var nextButton = document.getElementById('next');
nextButton.addEventListener('click', function() {
    console.log('loading next time');
    timeIndex++;
    renderSnapshot(timeIndex);
});

var prevButton = document.getElementById('previous');
prevButton.addEventListener('click', function() {
    timeIndex--;
    renderSnapshot(timeIndex);
});

var endButton = document.getElementById('end');
endButton.addEventListener('click', function() {
    if (interval) {
        clearInterval(interval);
    }
    timeIndex = timeSeriesData.length - 1;
    renderSnapshot(timeIndex);
});

var beginningButton = document.getElementById('beginning');
beginningButton.addEventListener('click', function() {
    if (interval) {
        clearInterval(interval);
    }
    timeIndex = 0;
    renderSnapshot(timeIndex);
});

var interval;
var playButton = document.getElementById('play');
playButton.addEventListener('click', function() {
    interval = setInterval(function() {
        if (timeIndex >= timeSeriesData.length - 1) {
            clearInterval(interval);
        }
        renderSnapshot(timeIndex);
        timeIndex++;
    }, 200);
});

var pauseButton = document.getElementById('pause');
pauseButton.addEventListener('click', function() {
    if (interval) {
        clearInterval(interval);
    }
});



function updateScooters(serverScooters) {
    for (var scooterId in serverScooters) {
        var scooter = serverScooters[scooterId];
        // if scooter exists, update its marker
        if (scooters[scooterId]) {
            var marker = scooters[scooterId].marker;
            var location = {lat: parseFloat(scooter.latitude), lng: parseFloat(scooter.longitude)};
            marker.setPosition(location)
        } else {
            // if we haven't seen this scooter before, create a marker for it.
            var location = {lat: parseFloat(scooter.latitude), lng: parseFloat(scooter.longitude)};
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: String(scooterId),
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 3
                }
            });
            scooter['marker'] = marker;
            scooters[scooterId] = scooter;
        }
    }
}





