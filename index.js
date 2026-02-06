class Landmark {
    constructor(title, description, image, coordinates) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.coordinates = coordinates;
    }
}

let landmarks = [];
let tempMarker = null;
let tempInfoWindow = null;

function placeTempMarker(latLng) {
    if (tempMarker) {
        tempMarker.setMap(null);
    }

    tempMarker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: latLng,
    });

    openLandmarkForm(latLng);
}


function addLandmarkMarker(landmark) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: landmark.coordinates,
    });

    const infoContent = `
        <div class="marker-info">
            <h3>${landmark.title}</h3>
            <p>${landmark.description}</p>
            <img src="${URL.createObjectURL(landmark.image)}" style="width: 200px; max-width: 100%;">
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: infoContent
    });

    marker.addListener("gmp-click", () => {
        infoWindow.open(map, marker);
    });
}

function openLandmarkForm(latLng) {
    const content = `
        <div id="addLandmarkForm">
            <h3>Add a Landmark</h3>
            <input id="titleInput" placeholder="Title" autocomplete="off"><br>
            <textarea id="descInput" placeholder="Description"></textarea><br>
            <input type="file" id="imageInput"><br>
            <button id="create">Create</button>
            <button id="cancel">Cancel</button>
        </div>
    `;

    tempInfoWindow = new google.maps.InfoWindow({
        content: content,
    });

    tempInfoWindow.open(map, tempMarker);

    google.maps.event.addListener(tempInfoWindow, "closeclick", () => {
        if (tempMarker) {
            tempMarker.setMap(null);
            tempMarker = null;
        }
    });

    google.maps.event.addListenerOnce(tempInfoWindow, "domready", () => {
        document.getElementById("create").addEventListener("click", () => {
            let landmark = new Landmark(
                document.getElementById("titleInput").value,
                document.getElementById("descInput").value,
                document.getElementById("imageInput").files[0],
                latLng,
            );

            landmarks.push(landmark);
            addLandmarkMarker(landmark);
            tempInfoWindow.close();
        });

        document.getElementById("cancel").addEventListener("click", () => {
            tempMarker.setMap(null);
            tempMarker = null;
            tempInfoWindow.close();
        });
    });
}


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 43.2375, lng: -79.8341},
        zoom: 11,
        mapId: "806ec8f84b08b4552faf418c",
        draggableCursor: "pointer",
        draggingCursor: "grab",
    });

    map.addListener("click", (event) => {
        placeTempMarker(event.latLng);
    })

    document.getElementById("locateButton").addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            placeTempMarker({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
        });
    });
}