const vegaEmbed = require('vega-embed');

// example copied from https://vega.github.io/vega-lite/usage/embed.html

// var yourVlSpec = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
//   description: 'A simple bar chart with embedded data.',
//   data: {
//     values: [
//       {a: 'A', b: 28},
//       {a: 'B', b: 55},
//       {a: 'C', b: 43},
//       {a: 'D', b: 91},
//       {a: 'E', b: 81},
//       {a: 'F', b: 53},
//       {a: 'G', b: 19},
//       {a: 'H', b: 87},
//       {a: 'I', b: 52}
//     ]
//   },
//   mark: 'bar',
//   encoding: {
//     x: {field: 'a', type: 'ordinal'},
//     y: {field: 'b', type: 'quantitative'}
//   }
// };
var yourVlSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  data: {
	url: "../data/cars.json"
  },
  encoding: {
    x: {
      field: "Year",
      type: "temporal",
      timeUnit: "year"
    }
  },
  layer: [
    {
      mark: {type: "errorband", extent: "ci"},
      encoding: {
        y: {
          field: "Miles_per_Gallon",
          type: "quantitative",
          title: "Mean of Miles per Gallon (95% CIs)"
        }
      }
    },
    {
      mark: "line",
      encoding: {
        y: {
          aggregate: "mean",
          field: "Miles_per_Gallon",
          type: "quantitative"
        }
      }
    }
  ]
};

vegaEmbed('#vis', yourVlSpec);
