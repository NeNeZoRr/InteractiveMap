document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("map");

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define the generateRandomSessionToken function
    function generateRandomSessionToken(length = 32) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) {
            result += characters[Math.floor(Math.random() * characters.length)];
        }
        return result;
    }

    function getUserLocationAndDisplayBusinesses(map) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                map.setView([userLat, userLng], 13);
                displayNearbyBusinesses(userLat, userLng);
            });
        }
    }

    async function displayNearbyBusinesses(userLat, userLng) {
        let sessionToken = generateRandomSessionToken();

        const inputField = document.getElementById("business");
        const ulField = document.querySelector(".explorer--dropdown-list");
        const notFoundField = document.querySelector(".explorer--not-found");
        const errorField = document.querySelector(".explorer--error");
        const dropDownField = document.querySelector(".explorer--dropdown");

        inputField.addEventListener("input", debounce(changeAutoComplete, 300));
        ulField.addEventListener("click", selectItem);

        const accessToken = 'fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo=';

        async function changeAutoComplete({ target }) {
            const { value: inputSearch = '' } = target;
            ulField.innerHTML = '';
            notFoundField.style.display = 'none';
            errorField.style.display = 'none';
            if (inputSearch.length && !isFetching) {
                try {
                    isFetching = true;
                    const results = await autoComplete(inputSearch);
                    if (results && results.length) {
                        results.forEach((value) => {
                            addItem(value);
                        });
                    } else {
                        notFoundField.innerHTML = `Foursquare can't find ${inputSearch}. Make sure your search is spelled correctly.  
                            <a href="https://foursquare.com/add-place?ll=${userLat}%2C${userLng}&venuename=${inputSearch}"
                            target="_blank" rel="noopener noreferrer">Don't see the place you're looking for?</a>.`;
                        notFoundField.style.display = 'block';
                    }
                } catch (err) {
                    errorField.style.display = 'block';
                    console.error(err);
                } finally {
                    isFetching = false;
                    dropDownField.style.display = 'block';
                }
            } else {
                dropDownField.style.display = 'none';
            }
        }

        async function autoComplete(query) {
            try {
                const searchParams = new URLSearchParams({
                    query,
                    types: 'place',
                    ll: `${userLat},${userLng}`,
                    radius: 50000,
                    session_token: sessionToken,
                }).toString();
                const searchResults = await fetch(
                    `https://api.foursquare.com/v3/autocomplete?${searchParams}`,
                    {
                        method: 'get',
                        headers: new Headers({
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        }),
                    }
                );
                const data = await searchResults.json();
                return data.results;
            } catch (error) {
                throw error;
            }
        }

        function addItem(value) {
            const placeDetail = value[value.type];
            if (!placeDetail || !placeDetail.geocodes || !placeDetail.geocodes.main) return;
            const { latitude, longitude } = placeDetail.geocodes.main;
            const fsqId = placeDetail.fsq_id;
            const dataObject = JSON.stringify({ latitude, longitude, fsqId });
            ulField.innerHTML +=
                `<li class="explorer--dropdown-item" data-object='${dataObject}'>
                <div>${highlightedNameElement(value.text)}</div>
                <div class="explorer--secondary-text">${value.text.secondary}</div>
            </li>`;
        }

        async function selectItem({ target }) {
            if (target.tagName === 'LI') {
                const valueObject = JSON.parse(target.dataset.object);
                const { latitude, longitude, fsqId } = valueObject;
                const placeDetail = await fetchPlacesDetails(fsqId);

                sessionToken = generateRandomSessionToken();
                const name = target.dataset.name;
                inputField.value = target.children[0].textContent;
                dropDownField.style.display = 'none';
            }
        }

        async function fetchPlacesDetails(fsqId) {
            try {
                const searchParams = new URLSearchParams({
                    fields: 'fsq_id,name,geocodes,location',
                    session_token: sessionToken,
                }).toString();
                const results = await fetch(
                    `https://api.foursquare.com/v3/places/${fsqId}?${searchParams}`,
                    {
                        method: 'get',
                        headers: new Headers({
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        }),
                    }
                );
                const data = await results.json();
                return data;
            } catch (err) {
                console.error(err);
            }
        }

        function highlightedNameElement(textObject) {
            if (!textObject) return '';
            const { primary, highlight } = textObject;
            if (highlight && highlight.length) {
                let beginning = 0;
                let hightligtedWords = '';
                for (let i = 0; i < highlight.length; i++) {
                    const { start, length } = highlight[i];
                    hightligtedWords += primary.substr(beginning, start - beginning);
                    hightligtedWords += '<b>' + primary.substr(start, length) + '</b>';
                    beginning = start + length;
                }
                hightligtedWords += primary.substr(beginning);
                return hightligtedWords;
            }
            return primary;
        }

        function debounce(func, timeout = 300) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, timeout);
            };
        }

        const data = null;

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                console.log(this.responseText);
            }
        });

        xhr.open('GET', 'https://api.foursquare.com/v3/places/search?query=Coffee%2C%20Hotels%2C%20Restaurants%2C%20Markets&ll=' + userLat + '%2C' + userLng + '&limit=5');
        xhr.setRequestHeader('accept', 'application/json');
        xhr.setRequestHeader('Authorization', 'fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo=');

        xhr.send(data);

        getUserLocationAndDisplayBusinesses(map);
    }
});

// Replace 'YOUR_FOURSQUARE_ACCESS_TOKEN' with your actual Foursquare access token


// APIKEY for UserLocation: fsq3NUNZQpfFDYQ3y9OC4GnGx9aW6j1sujKQFGN2B1m99kY=
// SecondAPIKey : fsq3cbwljwm8v5uArg1zxKLExjv/UH1z40joNlNa5SDVTjo=
// Extra API Key: fsq3sj2tvfSXwELQX2xOhyFNm9SpTHUmqH5jvwUWFnjnuWc=
// Client Id: EMKZEXFAZ1JPDGOMSMV4UL1CVPFVUM2AJNVLPRBPFDYYZ3MA
// Client Secret: I4F45DJ1DJWIE4FUPLV3ZDTP4ON1FFN4TTFXXRQ3JY0RGYAQ
// Replace 'YOUR ACCESS TOKEN' with your actual access token
