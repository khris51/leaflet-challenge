// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 5
});

// Adding the OpenStreetMap tile layer (default)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Adding the OpenTopoMap tile layer
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);

// Load the GeoJSON earthquake data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3.
d3.json(geoData).then(function(data) {
  // Create a Leaflet GeoJSON layer and add it to the map
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      // Create a circle marker for each earthquake
      return L.circleMarker(latlng, {
        radius: Math.sqrt(feature.properties.mag) * 3, // Adjust the size based on earthquake magnitude
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);
});

// Function to determine circle color based on earthquake magnitude
function getColor(magnitude) {
  return magnitude > 5 ? '#CD5C5C' :
         magnitude > 4 ? '#DFFF00' :
         magnitude > 3 ? '#800080' :
         magnitude > 2 ? '#800000' :
         magnitude > 1 ? '#0000FF' :
                         '#1a9850';
}

// Adding a legend
let legend = L.control({ position: "bottomleft" });
  
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let magnitudes = [0, 1, 2, 3, 4, 5];
  let colors = magnitudes.map(mag => getColor(mag));

  div.innerHTML = "<strong>Magnitude</strong><br>";
  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '">&nbsp;&nbsp;&nbsp;</i> ' +
      magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);
