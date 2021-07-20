var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 15,
  id: "light-v10",
  accessToken: API_KEY
});

// Create all of the energy LayerGroups we'll be using
var layers = {
  coal: new L.LayerGroup(),
  solar: new L.LayerGroup(),
  wind: new L.LayerGroup(),
  hydroelectric: new L.LayerGroup(),
  nuclear: new L.LayerGroup(),
  naturalgas: new L.LayerGroup(),
  other: new L.LayerGroup()
};

// Create the map and add the layers we created above
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
  ]
});

// Add our basemap(lightmap) tile layer to the map
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

// Import and read JSON from local file, console.log results to make sure data is imported correctly
d3.json("data/y2018.json",(infoRes) => {
console.log(infoRes)
    console.log(tech)

    // Create a blank object array that will be used in the legend to count each energy station generation type
    var stationCount = {
      coal: 0,
      solar: 0,
      wind: 0,
      hydroelectric: 0,
      nuclear: 0,
      naturalgas: 0,
      other: 0
    };

    // Initialize a stationStatusCode, which will be used to link layers to icons to stationCounts
    var stationStatusCode;

    // Loop through the stations and retreive relevant info from the JSON (Generation Type, Lat, Long, State the station is located in)
    for (var i = 0; i < infoRes.length; i++) {
      var tech = infoRes[i].Technology;
      var lat = infoRes[i].Latitude;
      var long = infoRes[i].Longitude;
      var state = infoRes[i].State;

      // Create a new station object with properties of both station objects
      
      // find all energy stations that use coal power
      if (tech === "Coal") {
        stationStatusCode = "coal";
      }
      // find all energy stations that use solar power
      else if (tech === "Solar") {
        stationStatusCode = "solar";
      }
      // find all energy stations that use wind power
      else if (tech === "Wind") {
        stationStatusCode = "wind";
      }
      // find all energy stations that use hydroelectric power
      else if (tech === "Hydroelectric") {
        stationStatusCode = "hydroelectric";
      }
      // find all energy stations that use nuclear power
      else if (tech === "Nuclear") {
        stationStatusCode = "nuclear";
      }
      // find all energy stations that use natural gas power
      else if (tech === "Natural Gas") {
        stationStatusCode = "naturalgas";
      }
      // all other generation types fall into the "other" category
      else {
        stationStatusCode = "other";
      }

      // Update the station count each time an energy count is found
      stationCount[stationStatusCode]++;
      // Create a new marker with the appropriate icon and coordinates based on statusCode(energy type)
      var newMarker = L.marker([lat, long], {
        icon: icons[stationStatusCode]
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[stationStatusCode]);

      // Bind a popup to the marker that will  display generation type and State on click.
      newMarker.bindPopup(tech + "<br> State: " + state);
    }

    // Call the updateLegend function, which will create the legend
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
