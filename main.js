        document.addEventListener("DOMContentLoaded", function() {
            var map = L.map('map').setView([51.505, -0.09], 13)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


            function searchPlaces() {
                var businessType = document.getElementById('business').value;
                var location = map.getCenter(); 
                var apiUrl = 'fsq3NUNZQpfFDYQ3y9OC4GnGx9aW6j1sujKQFGN2B1m99kY='; 


                var requestUrl = apiUrl + '?query=' + businessType + '&location=' + location.lat + ',' + location.lng;
            }

            // Handle form submission
            document.getElementById('submit').addEventListener('click', function(event) {
                event.preventDefault();
                searchPlaces();
            });
        });


// APIKEY for UserLocation: fsq3NUNZQpfFDYQ3y9OC4GnGx9aW6j1sujKQFGN2B1m99kY=
