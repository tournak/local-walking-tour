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

function openLandmarkForm(latLng) {
    const content = `
        <div id="addLandmarkForm">
            <h3>Add a Landmark</h3>
            <input id="titleInput" placeholder="Title"><br>
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
        if (tempMarker) {
            tempMarker.setMap(null);
        }

        tempMarker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: event.latLng,
        });

        openLandmarkForm(event.latLng);
    })
}