// Creating map object
var map = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// determine color of markers
function chooseColor(mag) {
  switch (true) {
  case (mag<1):
  return "#FFEDA0";
  case (mag>=1 && mag<2):
    return "#FED976";
  case (mag>=2 && mag<3):
    return "#FEB24C";
  case (mag>=3 && mag<4):
    return "#FD8D3C";
  case (mag>=4 && mag<5):
    return "#FC4E2A";
  case (mag >= 5):
    return "E31A1C";
  default:
    return "white";
  }
}



// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data,{


      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius: feature.properties.mag*5,
          color: chooseColor(feature.properties.mag),
          fill:true,
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity:0.8
        });
      },

      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title + "</h3>");
      },
    


  }).addTo(map);
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);