const moment = require("moment");
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
const palette = require("google-palette");

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2F0aHlyZWlkIiwiYSI6ImNrODgyMTN1ZjAwamQzbW1za3Qwa2VhM20ifQ.t2zzot1Qhgqf-EzMAhIFgQ";

const map = new mapboxgl.Map({
  container: "map", // container element id
  style: "mapbox://styles/mapbox/light-v10",
  center: [149.119, -35.28], // initial map center in [lon, lat]
  zoom: 15
});

map.addControl(
  new mapboxgl.NavigationControl({ showCompass: false }),
  "bottom-right"
);

// this function returns an array of 2-element [ts, "#color"] arrays
const calculateColorStops = (minTs, maxTs, numStops) => {
  const colors = palette("cb-BrBG", numStops);
  return colors.map((c, i) => [
    minTs + (maxTs - minTs) * (i / colors.length),
    `#${c}`
  ]);
};

// c'mon mapbox, surely there's a better way to do this...
const createWidgets = (minTs, maxTs, numStops) => {
  // colour legend
  const table = document.getElementById("legend");
  table.innerHTML = ""; // remove existing legend, if present

  const swatches = document.createElement("tr");

  for (let stop of calculateColorStops(minTs, maxTs, numStops)) {
    const swatch = document.createElement("td");
    swatch.style.background = stop[1];
    swatch.innerHTML = moment(stop[0]).format("MMM D");
    swatches.appendChild(swatch);
  }

  table.appendChild(swatches);

  const slider = document.getElementById("slider");
  slider.min = minTs;
  slider.max = maxTs;
  slider.value = minTs; // start at min value

  // TODO should debounce this...
  slider.addEventListener("input", function(e) {
    const ts = parseInt(e.target.value, 10);
    filterDotsInTimeWindow(ts, ts == minTs);
  });
};

const filterDotsInTimeWindow = (ts, reset) => {
  if (reset) {
    map.setFilter("track-and-trace", null);
    document.getElementById("time-window-centrepoint").textContent = "all time";
  } else {
    const windowSize = 1 * 60 * 60 * 1000; // 2 hours total (ts +/- 1hr)

    map.setFilter("track-and-trace", [
      "all",
      [">", "time", ts - windowSize / 2],
      ["<", "time", ts + windowSize / 2]
    ]);

    // Set the label to the month
    document.getElementById("time-window-centrepoint").textContent =
      moment(ts).format("h:mma ddd MMM D") + " (+/- 1hr)";
  }
};

const getTimeBounds = geoJsonData => {
  times = geoJsonData.features.map(f => f.properties.time);
  return [Math.min(...times), Math.max(...times)];
};

map.on("load", function() {
  // first, fetch the data
  // do this separately so we can set up the legend as well
  fetch("../data/raw-data.geojson")
    .then(response => response.json())
    .then(geoData => {
      const timeRange = getTimeBounds(geoData);
      const numColorStops = 4;
      const colorStops = calculateColorStops(
        timeRange[0],
        timeRange[1],
        numColorStops
      );

      createWidgets(timeRange[0], timeRange[1], numColorStops);

      // set up the map
      map.addLayer({
        id: "track-and-trace",
        type: "circle",
        source: {
          type: "geojson",
          data: geoData
        },
        paint: {
          "circle-radius": 7,
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "time"],
            ...colorStops.flat() // don't get too clever, Ben...
          ],
          "circle-opacity": 0.8
        }
      });
    });
});
