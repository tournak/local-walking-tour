class Landmark {
    constructor(title, description, image, coordinates) {
        this.title = title;
        this.description = description;
        this.imageURL = URL.createObjectURL(image);
        this.coordinates = coordinates;
    }
}

let landmarks = [];
let tempMarker = null;
let tempInfoWindow = null;

function renderLandmarkList() {
    let landmarkList = document.getElementById("landmarkList");
    landmarkList.innerHTML = "<h3>Landmark List</h3>";

    landmarks.forEach(landmark => {
        let div = document.createElement("div");
        div.className = "landmark-item";

        let img = document.createElement("img");
        img.src = landmark.imageURL;
        img.className = "landmark-thumbnail";

        let title = document.createElement("span");
        title.textContent = landmark.title;

        div.appendChild(img);
        div.appendChild(title);

        div.addEventListener("click", () => {
            map.setCenter(landmark.coordinates);
            google.maps.event.trigger(landmark.marker, "gmp-click");
            highlightListItem(div);
        });

        landmark.listItem = div;
        landmarkList.appendChild(div);
    });
}


function highlightListItem(listItem) {
    landmarks.forEach(landmark => {
        landmark.listItem.classList.remove("highlight");
    })

    listItem.classList.add("highlight");
}

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

    landmark.marker = marker;

    const infoContent = `
        <div class="marker-info">
            <h3>${landmark.title}</h3>
            <p>${landmark.description}</p>
            <img src="${landmark.imageURL}" style="width: 200px; max-width: 100%;" alt=${landmark.title}>
            <button class="deleteButton">Remove Marker</button>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: infoContent
    });

    marker.addListener("gmp-click", () => {
        infoWindow.open(map, marker);
    });

    google.maps.event.addListener(infoWindow, "domready", () => {
        document.querySelector(".deleteButton").addEventListener("click", () => {
            marker.setMap(null);
            landmarks = landmarks.filter(l => l !== landmark);
            renderLandmarkList();
            infoWindow.close();
        })
    });

    renderLandmarkList();
}

function openLandmarkForm(latLng) {
    const content = `
        <div id="addLandmarkForm">
            <h3>Add a Landmark</h3>
            <form>
                <input id="titleInput" placeholder="Title" autocomplete="off" required><br>
                <textarea id="descInput" placeholder="Description" required></textarea><br>
                <input type="file" id="imageInput" required><br>
                <button id="create">Create</button>
                <button id="cancel">Cancel</button>
            </form>
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

    document.getElementById("coordinatesButton").addEventListener("click", (event) => {
        event.preventDefault();
        placeTempMarker({
            lat: parseFloat(document.getElementById("latitudeInput").value),
            lng: parseFloat(document.getElementById("longitudeInput").value),
        });
    })
}