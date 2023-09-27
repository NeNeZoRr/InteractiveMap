//I am currently having problems getting the API, HTTPS to fetch and pull. 
//4spaces API issues. 


document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("map").setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var userMarker;

    function addYouAreHereMarker(lat, lng) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        userMarker = L.marker([lat, lng]).addTo(map);
        userMarker.bindPopup("You Are Here").openPopup();
    }

    function displayLocationOnMap(location) {
        var lat = location.lat;
        var lng = location.lng;
        var name = location.name;

        var marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(name);
        map.setView([lat, lng], 13);
    }

    var searchButton = document.getElementById("search");
    var businessSelect = document.getElementById("business");
    var locationTypeSelect = document.getElementById("location-type");

    searchButton.addEventListener("click", function (e) {
        e.preventDefault();
        var selectedBusiness = businessSelect.value;
        getUserLocationAndDisplayPlaces(selectedBusiness);
    });

    businessSelect.addEventListener("change", function () {
        var selectedBusiness = businessSelect.value;
        getUserLocationAndDisplayPlaces(selectedBusiness);
    });

    function getUserLocationAndDisplayPlaces(business) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                map.setView([userLat, userLng], 13);
                addYouAreHereMarker(userLat, userLng);

                fetchAndDisplayLocations(userLat, userLng, business);
            });
        }
    }

    function fetchAndDisplayLocations(userLat, userLng, business) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo='
            }
        };

        fetch('https://api.foursquare.com/v2/venues/explore?ll=' + userLat + ',' + userLng + '&query=' + business + '&limit=5', options)
            .then(response => response.json())
            .then(response => {
                var places = response.response.groups[0].items;
                console.log(places);

                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                places.forEach(function (place) {
                    var lat = place.venue.location.lat;
                    var lng = place.venue.location.lng;
                    var name = place.venue.name;

                    var marker = L.marker([lat, lng]).addTo(map);
                    marker.bindPopup(name);
                });
            })
            .catch(err => console.error(err));
    }

    getUserLocationAndDisplayPlaces("all");

    const autocompleteOptions = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo='
        }
    };

    const autocompleteUrl = 'https://api.foursquare.com/v3/autocomplete?query=coffee,coffee shops,hotel,hotels,markets,markets,restaurants,restaurant';

    fetch(autocompleteUrl, autocompleteOptions)
        .then(response => response.json())
        .then(response => {

            console.log(response);

            var businessSelect = document.getElementById("business");
            response.response.minivenues.forEach(function (venue) {
                var option = document.createElement("option");
                option.value = venue.name;
                option.text = venue.name;
                businessSelect.appendChild(option);
            });
        })
        .catch(err => console.error(err));

    businessSelect.addEventListener("change", function () {
        var selectedLocation = businessSelect.value;

        var location = locations.find(loc => loc.name === selectedLocation);
        if (location) {
            displayLocationOnMap(location);
        }
    });

    function addLocationMarkersToMap() {

        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        locations.forEach(function (location) {
            var lat = location.lat;
            var lng = location.lng;
            var name = location.name;

            var marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(name);
        });
    }

    locationTypeSelect.addEventListener("change", function () {
        var selectedLocationType = locationTypeSelect.value;


        updateLocations(selectedLocationType);


        addLocationMarkersToMap();
    });

    updateLocations("Coffee");
    addLocationMarkersToMap();
});

// APIKEY for UserLocation: fsq3NUNZQpfFDYQ3y9OC4GnGx9aW6j1sujKQFGN2B1m99kY=
// SecondAPIKey : fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo=
// Extra API Key: fsq3sj2tvfSXwELQX2xOhyFNm9SpTHUmqH5jvwUWFnjnuWc=
// Client Id: EMKZEXFAZ1JPDGOMSMV4UL1CVPFVUM2AJNVLPRBPFDYYZ3MA
// Client Secret: I4F45DJ1DJWIE4FUPLV3ZDTP4ON1FFN4TTFXXRQ3JY0RGYAQ

// APIKEY for UserLocation: fsq3NUNZQpfFDYQ3y9OC4GnGx9aW6j1sujKQFGN2B1m99kY=
// SecondAPIKey : fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo=
// Extra API Key: fsq3sj2tvfSXwELQX2xOhyFNm9SpTHUmqH5jvwUWFnjnuWc=
// Client Id: EMKZEXFAZ1JPDGOMSMV4UL1CVPFVUM2AJNVLPRBPFDYYZ3MA
// Client Secret: I4F45DJ1DJWIE4FUPLV3ZDTP4ON1FFN4TTFXXRQ3JY0RGYAQ

