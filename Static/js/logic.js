function createMap(coal){

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});
    
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});
       

var baseLayers = {
    "Light": light,
    "Dark": dark       
};

var overlays = {
    "Coal": coal,
    
};

var mymap = L.map('map-id', {
    center: [29.8968, -110.5828],
    zoom: 3.5,
    layers: [light, dark, coal]
});

L.control.layers(baseLayers, overlays).addTo(mymap);
}

function createMarkers() {
    var coal = "data/coal.json";

    var coalMarkers = [];

    for (var index = 0; index < coal.length; index++) {
        var generator = coal[index];

        var coalMarker = L.marker([coal.Latitude, coal.Longitude])
        .bindPopup("<h3>" + coal.technology + "<h3><h3>State: " + coal.State + "<h3> Year:" + coal.year + "<h3></h3>");

        coalMarkers.push(coalMarker)
    }

    createMap(l.layergroup(coalMarkers));

}

