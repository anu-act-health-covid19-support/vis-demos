mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0aHlyZWlkIiwiYSI6ImNrODgyMTN1ZjAwamQzbW1za3Qwa2VhM20ifQ.t2zzot1Qhgqf-EzMAhIFgQ';

var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [149.119, -35.280], // initial map center in [lon, lat]
  zoom: 15
});

const timeColorMapping = [[1584685015006, "#eb4d4b"], [1585094785740, "#4834d4"]];

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
});
