class Landmark {
    constructor(title, description, image, coordinates) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.coordinates = coordinates;
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 43.2375, lng: -79.8341},
        zoom: 11,
        mapId: "806ec8f84b08b4552faf418c"
    });
}