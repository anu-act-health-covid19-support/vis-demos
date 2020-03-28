const moment = require('moment');
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2F0aHlyZWlkIiwiYSI6ImNrODgyMTN1ZjAwamQzbW1za3Qwa2VhM20ifQ.t2zzot1Qhgqf-EzMAhIFgQ";

const map = new mapboxgl.Map({
  container: "map", // container element id
  style: "mapbox://styles/mapbox/light-v10",
  center: [149.119, -35.28], // initial map center in [lon, lat]
  zoom: 15
});

// hardcoded values based on Kathy's test data for now - will make this
// data-driven later
const timeColorMapping = [
  [1584685015006, "#eb4d4b"],
  [1585094785740, "#4834d4"]
];

// c'mon mapbox, surely there's a better way to do this...
const populateLegend = () => {
  const table = document.getElementById("legend");
  const swatches = document.createElement("tr");

  for (i = 0; i < timeColorMapping.length; i++) {
    const swatch = document.createElement("td");
    swatch.style.background = timeColorMapping[i][1];
    swatch.innerHTML = moment(timeColorMapping[i][0]).format("MMMM D");
    swatches.appendChild(swatch);
  }

  table.appendChild(swatches);
};

const configureSlider = () => {
  const slider = document.getElementById("slider");
  slider.min = timeColorMapping[0][0];
  slider.value = timeColorMapping[0][0];
  slider.max = timeColorMapping[timeColorMapping.length - 1][0];
};

const filterDotsInTimeWindow = ts => {
  // if the slider is on the min value, remove all filters (i.e. show all the data points)
  if (ts == timeColorMapping[0][0]) {
    map.setFilter("track-and-trace", null);
    document.getElementById(
      "time-window-centrepoint"
    ).textContent = "all time";
  } else {
    const windowSize = 1 * 60 * 60 * 1000; // 2 hours total (ts +/- 1hr)

    map.setFilter("track-and-trace", [
      "all",
      [">", "time", ts - windowSize / 2],
      ["<", "time", ts + windowSize / 2]
    ]);

    // Set the label to the month
    document.getElementById(
      "time-window-centrepoint"
    ).textContent = moment(ts).format("h:mma ddd MMM D") + " (+/- 1hr)";
  }
};

map.on("load", function() {
  map.addLayer({
    id: "track-and-trace",
    type: "circle",
    source: {
      type: "geojson",
      data: "data/raw-data.geojson"
    },
    paint: {
      "circle-radius": 7,
      "circle-stroke-color": "white",
      "circle-stroke-width": 1,
      "circle-color": [
        "interpolate",
        ["linear"],
        ["get", "time"],
        ...timeColorMapping.flat() // don't get too clever, Ben...
      ],
      "circle-opacity": 0.8
    }
  });

  populateLegend();
  configureSlider();

  document.getElementById("slider").addEventListener("input", function(e) {
    const ts = parseInt(e.target.value, 10);
    filterDotsInTimeWindow(ts);
  });
});
