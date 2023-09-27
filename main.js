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

    searchButton.addEventListener("click", function (e) {
        e.preventDefault();
        var selectedBusiness = businessSelect.value;
        getUserLocationAndDisplayPlaces(selectedBusiness);
    });

    businessSelect.addEventListener("change", function () {
        var selectedBusiness = businessSelect.value;
        getUserLocationAndDisplayPlaces(selectedBusiness);
    });

    // Define Foursquare API credentials here
    const clientId = 'EMKZEXFAZ1JPDGOMSMV4UL1CVPFVUM2AJNVLPRBPFDYYZ3MA'; // Replace with your Foursquare client ID
    const clientSecret = 'I4F45DJ1DJWIE4FUPLV3ZDTP4ON1FFN4TTFXXRQ3JY0RGYAQ'; // Replace with your Foursquare client secret

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
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://api.foursquare.com/v2/venues/explore';

        const params = new URLSearchParams({
            ll: userLat + ',' + userLng,
            query: business,
            limit: 5,
            client_id: clientId,
            client_secret: clientSecret,
            v: '20230927' // Foursquare API version
        });

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        fetch(proxyUrl + apiUrl + '?' + params.toString(), options)
            .then(response => response.json())
            .then(response => {
                var places = response.response.groups[0].items; // Extract places from the response.
                console.log(places);

                // Clear existing markers.
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Add places to the map as markers.
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

});

    // Autocomplete Suggestions
    const autocompleteOptions = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };

    const autocompleteUrl = 'https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v2/venues/suggestcompletion';
    const autocompleteParams = new URLSearchParams({
        ll: '40.748817,-73.985428', // New York City coordinates (you can adjust this)
        v: '20230927', // Foursquare API version
        query: 'coffee,coffee shops,hotel,hotels,markets,markets,restaurants,restaurant',
        client_id: clientId,
        client_secret: clientSecret
    });

    fetch(proxyUrl + autocompleteUrl + '?' + autocompleteParams.toString(), autocompleteOptions)
        .then(response => response.json())
        .then(response => {
            // Handle autocomplete suggestions response here.
            console.log(response);

            // Bind the autocomplete suggestions to the dropdown menu.
            var businessSelect = document.getElementById("business");
            response.response.minivenues.forEach(function (venue) {
                var option = document.createElement("option");
                option.value = venue.name;
                option.text = venue.name;
                businessSelect.appendChild(option);
            });
        })
        .catch(err => console.error(err));
    displayLocationOnMap()
    // Initialize with the default business (All) when the page loads.
    getUserLocationAndDisplayPlaces("all");


// APIKEY for UserLocation: fsq3NUNZQpfFDYQ3y9OC4GnGx9aW6j1sujKQFGN2B1m99kY=
// SecondAPIKey : fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo=
// Extra API Key: fsq3sj2tvfSXwELQX2xOhyFNm9SpTHUmqH5jvwUWFnjnuWc=
// Client Id: EMKZEXFAZ1JPDGOMSMV4UL1CVPFVUM2AJNVLPRBPFDYYZ3MA
// Client Secret: I4F45DJ1DJWIE4FUPLV3ZDTP4ON1FFN4TTFXXRQ3JY0RGYAQ

