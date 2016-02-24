var mapElem = document.getElementById('map');
var windowHeight = window.innerHeight - 60;
mapElem.style.height = windowHeight + 'px';
var map;
var timeIndex = 0;
var lastTimeIndex = 0;
var scooters = {};

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
            lastTimeIndex = response.lastTimeIndex;
            var serverScooters = response.scooters;
            var timestamp = response.timestamp;
            var localTime = new Date(timestamp * 1000);
            var timestampLabel = document.getElementById('timestamp');
            var prettyDate = moment(localTime).format('MMMM Do YYYY, h:mm:ss a');
            timestampLabel.innerHTML = prettyDate;
            var chargeLabel = document.getElementById('charge');
            var averageCharge = getAverageCharge(serverScooters);
            chargeLabel.innerHTML = averageCharge.toFixed(2) + '%';
            var availableLabel = document.getElementById('available');
            var scootsAvailable = serverScooters.length;
            availableLabel.innerHTML = scootsAvailable;
            var scootilizationPercentage = getScootilizationPercentage(scootsAvailable);
            var scootilizationLabel = document.getElementById('scootilization');
            scootilizationLabel.innerHTML = scootilizationPercentage.toFixed(2) + '%';
            getHighestScootNumber(serverScooters);
            updateScooters(serverScooters);

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

var endButton = document.getElementById('end');
endButton.addEventListener('click', function() {
    if (interval) {
        clearInterval(interval);
    }
    timeIndex = lastTimeIndex;
    getScooters(timeIndex);
});

var beginningButton = document.getElementById('beginning');
beginningButton.addEventListener('click', function() {
    timeIndex = 0;
    getScooters(timeIndex);
});

var interval;
var playButton = document.getElementById('play');
playButton.addEventListener('click', function() {
    interval = setInterval(function() {
        if (timeIndex === lastTimeIndex) {
            clearInterval(interval);
        }
        getScooters(timeIndex);
        timeIndex++;
    }, 200);
});

var pauseButton = document.getElementById('pause');
pauseButton.addEventListener('click', function() {
    if (interval) {
        clearInterval(interval);
    }
});


beginningButton.addEventListener('click', function() {
    if (interval) {
        clearInterval(interval);
    }
    timeIndex = 0;
    getScooters(timeIndex);
});

function updateScooters(serverScooters) {
    serverScooters.forEach(function(scooter) {
        // if scooter exists, update its marker
        if (scooters[scooter.physical_scoot_id]) {
            var marker = scooters[scooter.physical_scoot_id].marker;
            var location = {lat: parseFloat(scooter.latitude), lng: parseFloat(scooter.longitude)};
            marker.setPosition(location)
        } else {
            // if we haven't seen this scooter before, create a marker for it.
            var location = {lat: parseFloat(scooter.latitude), lng: parseFloat(scooter.longitude)};
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: String(scooter.physical_scoot_id),
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 3
                }
            });
            scooter['marker'] = marker;
            scooters[scooter.physical_scoot_id] = scooter;
        }
    });
}

function getAverageCharge(scooters) {
    var totalCharge = 0;
    scooters.forEach(function(scooter) {
        totalCharge += parseFloat(scooter.batt_pct_smoothed);
    });
    return totalCharge / scooters.length;
}

function getHighestScootNumber(scooters) {
    var highestScootNumber = 0;
    scooters.forEach(function(scooter) {
        if (scooter.physical_scoot_id > highestScootNumber) {
            highestScootNumber = scooter.physical_scoot_id;
        }
    });
    console.log('highest scoot: ' + highestScootNumber);
}

function getScootilizationPercentage(availableScootCount) {
    // FAQ says 400 scoots total
    return (400 - availableScootCount) / 400 * 100;
}




