mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0aHlyZWlkIiwiYSI6ImNrODgyMTN1ZjAwamQzbW1za3Qwa2VhM20ifQ.t2zzot1Qhgqf-EzMAhIFgQ';

var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [149.119, -35.280], // initial map center in [lon, lat]
  zoom: 15
});

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
					   1584685015006, 'rgb(255, 76, 54)',
					   1585094785740, 'rgb(76, 114, 246)'
	  ],
	  'circle-opacity': 0.8
	}
  });
});
