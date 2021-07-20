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

var mymap = L.map('map', {
    center: [29.8968, -110.5828],
    zoom: 3.5,
    layers: [light, dark, coal]
});

L.control.layers(baseLayers, overlays).addTo(mymap);
}

var coalJSON = "https://github.com/abhikenobi/The-Coalition/blob/main/Resource/Json/coal.json"

// d3.json(coalJSON, function(coalJSON) {
//     root = coalJSON;
//     root.x0 = h / 2;
//     root.y0 = 0;
// });

d3.json(coalJSON).then(function(data){ console.log(data)});

function createMarkers() {
    //var coalJSON = d3.json("Resources/coal.json");
    //var generators = coalJSON.coal.Station_ID;

    var coalMarkers = [];

    for (var index = 0; index < coalJSON.length; index++) {
        var generator = coalJSON[index];

        var coalMarker = L.marker([coalJSON.coal.Latitude, coalJSON.coal.Longitude])
        .bindPopup("<h3>" + coalJSON.Technology + "<h3><h3>State: " + coalJSON.State + "<h3> Year:" + coalJSON.Year + "<h3></h3>");

        coalMarkers.push(coalMarker);
        //console.log(coalJSON.Latitude, coalJSON.Longitude);
    }

    createMap(L.layerGroup(coalMarkers));

};

// function createMarkers() {
//     var coal = "../Resources/coal";

//     var coalMarkers = [];

//     for (var index = 0; index < coal.length; index++) {
//         var generator = coal[index];

//         var coalMarker = L.marker([coal.Latitude, coal.Longitude])
//         .bindPopup("<h3>" + coal.technology + "<h3><h3>State: " + coal.State + "<h3> Year:" + coal.year + "<h3></h3>");

//         coalMarkers.push(coalMarker)
//     }

//     createMap(l.layergroup(coalMarkers));

// }