mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0aHlyZWlkIiwiYSI6ImNrODgyMTN1ZjAwamQzbW1za3Qwa2VhM20ifQ.t2zzot1Qhgqf-EzMAhIFgQ';

const map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [149.119, -35.280], // initial map center in [lon, lat]
  zoom: 15
});

// hardcoded values based on Kathy's test data for now - will make this
// data-driven later
const timeColorMapping = [[1584685015006, "#eb4d4b"], [1585094785740, "#4834d4"]];

// cmon mapbox, surely there's a better way to do this...
const populateLegend = () => {
  const legend = document.getElementById('legend');

  let spans = [];
  let labels = [];

  for (i = 0; i < timeColorMapping.length; i++) {

	const label = document.createElement('label');
	const dt = new Date(timeColorMapping[i][0]);
	label.style.background = timeColorMapping[i][1];
	label.innerHTML = dt.toLocaleString();
	legend.appendChild(label);
  }
};

const configureSlider = () => {
  const slider = document.getElementById('slider');
  slider.min = timeColorMapping[0][0];
  slider.value = timeColorMapping[0][0];
  slider.max = timeColorMapping[timeColorMapping.length - 1][0];
};

const filterDotsInTimeWindow = (ts) => {

  console.log(ts);
  const windowSize = 3*60*60*1000; // 3 hours

  const windowFilters = ['all',
				 ['>', 'time', ts-windowSize/2],
				 ['<', 'time', ts+windowSize/2]];
  map.setFilter('track-and-trace', windowFilters);
  // Set the label to the month
  const dt = new Date(ts);
  document.getElementById('time-window-centrepoint').textContent = dt.toLocaleString();
}

map.on('load', function() {

  map.addLayer({
	id: 'track-and-trace',
	type: 'circle',
	source: {
	  type: 'geojson',
	  data: 'data/raw-data.geojson'
	},
	paint: {
	  'circle-radius': 7,
	  'circle-stroke-color': "white",
	  'circle-stroke-width': 1,
	  'circle-color': ['interpolate',
					   ['linear'],
					   ['get', 'time'],
					   ...(timeColorMapping.flat()), // don't get too clever, Ben...
					  ],
	  'circle-opacity': 0.8
	}
  });

  populateLegend();
  configureSlider();

  document
	.getElementById('slider')
	.addEventListener('input', function(e) {
	  const ts = parseInt(e.target.value, 10);
	  filterDotsInTimeWindow(ts);
	});
});


