var locations = [];

function addLocation(name, lat, lng) {
    locations.push({
        name: name,
        lat: lat,
        lng: lng
    });
}

function updateLocations(locationType) {
    locations = [];

    if (locationType === "Coffee") {
        addLocation("Coffee Place 1", 40.12345, -74.56789);
        addLocation("Coffee Place 2", 40.23456, -74.67890);

    } else if (locationType === "Hotel") {
        addLocation("Hotel 1", 40.34567, -74.78901);
        addLocation("Hotel 2", 40.45678, -74.89012);

    } else if (locationType === "Market") {
        addLocation("Market 1", 40.56789, -74.90123);
        addLocation("Market 2", 40.67890, -74.01234);

    } else if (locationType === "Restaurant") {
        addLocation("Restaurant 1", 40.78901, -74.12345);
        addLocation("Restaurant 2", 40.89012, -74.23456);
    }
}
