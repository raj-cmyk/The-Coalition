var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 15,
  id: "light-v10",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  coal: new L.LayerGroup(),
  solar: new L.LayerGroup(),
  wind: new L.LayerGroup(),
  hydroelectric: new L.LayerGroup(),
  nuclear: new L.LayerGroup(),
  naturalgas: new L.LayerGroup(),
  other: new L.LayerGroup()

//   NORMAL: new L.LayerGroup(),
//   OUT_OF_ORDER: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map", {
  center: [40.426726271279165, -99.65842250402241],
  zoom: 5,
  layers: [
    layers.coal,
    layers.solar,
    layers.wind,
    layers.hydroelectric,
    layers.nuclear,
    layers.naturalgas,
    layers.other
    //layers.NORMAL,
    //layers.OUT_OF_ORDER
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Coal": layers.coal,
  "Solar": layers.solar,
  "Wind": layers.wind,
  "Hydroelectric": layers.hydroelectric,
  "Nuclear": layers.nuclear,
  "Natural Gas": layers.naturalgas,
  "Other": layers.other
  //"Healthy Stations": layers.NORMAL,
  //"Out of Order": layers.OUT_OF_ORDER
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  coal: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "black",
    shape: "circle"
  }),
  solar: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "yellow",
    shape: "square"
  }),
  wind: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "grey",
    shape: "square"
  }),
  hydroelectric: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "blue",
    shape: "square"
  }),
  nuclear: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  naturalgas: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  }),
  other: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "purple",
    shape: "circle"
  })
};

// Perform an API call to the Citi Bike Station Information endpoint
d3.json("data/y2018.json",(infoRes) => {
console.log(infoRes)
  // // When the first API call is complete, perform another call to the Citi Bike Station Status endpoint
  // //d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json", function(statusRes) {
  //   //var stationStatus = statusRes.data.stations;
  //   //var updatedAt = infoRes.last_updated;
  //   //var stationInfo = infoRes.data.stations;
    
    console.log(tech)
    // Create an object to keep of the number of markers in each layer
    var stationCount = {
      coal: 0,
      solar: 0,
      wind: 0,
      hydroelectric: 0,
      nuclear: 0,
      naturalgas: 0,
      other: 0
    };

    // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
    var stationStatusCode;

    // Loop through the stations (they're the same size and have partially matching data)
    for (var i = 0; i < infoRes.length; i++) {
      var tech = infoRes[i].Technology;
      var lat = infoRes[i].Latitude;
      var long = infoRes[i].Longitude;
      var state = infoRes[i].State;

      // Create a new station object with properties of both station objects
      //var station = Object.assign({}, tech[i], stationStatus[i]);
      // If a station is listed but not installed, it's coming soon
      if (tech === "Coal") {
        stationStatusCode = "coal";
      }
      // If a station has no bikes available, it's empty
      else if (tech === "Solar") {
        stationStatusCode = "solar";
      }
      // If a station is installed but isn't renting, it's out of order
      else if (tech === "Wind") {
        stationStatusCode = "wind";
      }
      // If a station has less than 5 bikes, it's status is low
      else if (tech === "Hydroelectric") {
        stationStatusCode = "hydroelectric";
      }
      else if (tech === "Nuclear") {
        stationStatusCode = "nuclear";
      }
      else if (tech === "Natural Gas") {
        stationStatusCode = "naturalgas";
      }
      // Otherwise the station is normal
      else {
        stationStatusCode = "other";
      }

      // Update the station count
      stationCount[stationStatusCode]++;
      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([lat, long], {
        icon: icons[stationStatusCode]
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[stationStatusCode]);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup(tech + "<br> State: " + state);
    }

    // Call the updateLegend function, which will... update the legend!
    updateLegend(stationCount);
});


// Update the legend's innerHTML with the last updated time and station count
function updateLegend(stationCount) {
  document.querySelector(".legend").innerHTML = [
    "<p class='Coal'>Coal: " + stationCount.coal + "</p>",
    "<p class='Solar'>Solar: " + stationCount.solar + "</p>",
    "<p class='Wind'>Wind: " + stationCount.wind + "</p>",
    "<p class='Hydroelectric'>Hydrelectric: " + stationCount.hydroelectric + "</p>",
    "<p class='Nuclear'>Nuclear: " + stationCount.nuclear + "</p>",
    "<p class='NaturalGas'>Natural Gas: " + stationCount.naturalgas + "</p>",
    "<p class='Other'>Other: " + stationCount.other + "</p>"
  ].join("");
}
