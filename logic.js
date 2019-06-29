// Create the map center
var myMap = L.map("map", {
  center: [39, -100],
  zoom: 4.5
});

// Add streetmap tile layer
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// All earthquakes in the past 7 days greater than 1 in magnitude
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Retrieve data from query url
d3.json(url, function (data) {

  // Add size and color earthquakes based on magnitude
  function style(feature) {
    return {
      fillColor: chooseColor(feature.properties.mag),
      weight: 0.4,
      opacity: 1,
      color: "black",
      fillOpacity: 1,
      radius: 8 * (feature.properties.mag)
    };
  }

  //function for color selection based on magnitude
  function chooseColor(mag) {
    if (mag > 5) { return "#ea2c2c" }
    else if (mag > 4) { return "#ea822c" }
    else if (mag > 3) { return "#ee9c00" }
    else if (mag > 2) { return "#eecc00" }
    else if (mag > 1) { return "#d4ee00" }
    else { return "#98ee00" }
  }

  //Map geojson data with pop-up info regarding magnitude and location of earthquake
  var earthquake_data = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: style,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap); 

  // Set up the legend in top right and define limits and labels
  var legend = L.control({ position: "topright" });
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var mag = ["5 + ", "4",  "3", "2", "1"];
    var colors = ["#ea2c2c","#ea822c", "#ee9c00","#eecc00","#d4ee00"];
    var labels = [];

      div.innerHTML = "<h3>Magnitude</h3>";
  
    mag.forEach(function (mag, index) {
      labels.push(`<tr><td class="legend-color" style="background-color: ${colors[index]}"></td><td>${mag}</td></tr>`);
    });
      div.innerHTML += "<table>" + labels.join("") + "</table>";
    return div;
  };
    // Add legend to the map
    legend.addTo(myMap);
  });