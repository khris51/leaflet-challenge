// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 3,
});

// Adding the OpenStreetMap tile layer (default)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Adding the OpenTopoMap tile layer
let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
}).addTo(myMap);

// Load the GeoJSON earthquake data.
let geoData =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Define base layers
let baseLayers = {
  OpenStreetMap: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ),
  OpenTopoMap: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }),
  Satellite: L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  ),
};

// Create a layer group for overlays
let overlays = {
  "Tectonic Plates": L.geoJSON()
  //  Earthquakes: L.geoJSON(),
};

// Add tectonic plate boundaries data to the overlays
$.getJSON(plateBoundariesURL, function (plateBoundaries) {
  overlays["Tectonic Plates"].addData(plateBoundaries);
});

// Load the GeoJSON earthquake data and add it to the overlays
d3.json(geoData).then(function (data) {
  overlays["Earthquakes"].addData(data);
});

// Add a control layer
L.control.layers(baseLayers, overlays).addTo(myMap);

// Set the default base layer
baseLayers["OpenStreetMap"].addTo(myMap);

// Get the data with d3.
d3.json(geoData).then(function (data) {
  // Create a Leaflet GeoJSON layer and add it to the map
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      // Create a circle marker for each earthquake
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5, // Adjust the size based on earthquake magnitude
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Location: " +
          feature.properties.place +
          "<br>Depth: " +
          feature.geometry.coordinates[2]
      );
    },
  }).addTo(myMap);
});

// Function to determine circle color based on earthquake magnitude
function getColor(magnitude) {
  return magnitude > 90
    ? "red"
    : magnitude >  70
    ? "orangered"
    : magnitude > 50
    ? "orange"
    : magnitude >  30
    ? "yellow"
    : magnitude > 10
    ? "yellowgreen"
    : "green";
}

// Adding a legend
let legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  let magnitudes = [-10, 10, 30, 50, 70, 90];
  let colors = ["green","yellowgreen","yellow","orange","orangered","red"]

  div.innerHTML = "<strong>Magnitude</strong><br>";
  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      colors[i] +
      '">&nbsp;&nbsp;&nbsp;</i> ' +
      magnitudes[i] +
      (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(myMap);

// Retrieve tectonic plate boundaries data
var plateBoundariesURL =
  "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
$.getJSON(plateBoundariesURL, function (plateBoundaries) {
  // Add tectonic plate boundaries to the map
  L.geoJSON(plateBoundaries, {
    style: function (feature) {
      return {
        color: "orange",
        weight: 2,
      };
    },
  }).addTo(myMap); // Corrected the map object reference to myMap
});
// Define base layers
let Layers = {
  OpenStreetMap: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ),
  OpenTopoMap: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }),
  Satellite: L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  ),
};

// Create a layer group for overlays
let overlay = {
  "Tectonic Plates": L.geoJSON(),
  Earthquakes: L.geoJSON(),
};

// Add tectonic plate boundaries data to the overlays
$.getJSON(plateBoundariesURL, function (plateBoundaries) {
  overlays["Tectonic Plates"].addData(plateBoundaries);
});

// Load the GeoJSON earthquake data and add it to the overlays
d3.json(geoData).then(function (data) {
  overlays["Earthquakes"].addData(data);
});

// Add a control layer
L.control.layers(baseLayers, overlays).addTo(myMap);

// Set the default base layer
baseLayers["OpenStreetMap"].addTo(myMap);
