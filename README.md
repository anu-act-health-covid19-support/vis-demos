# geojson-over-time

A demo of GeoJSON over time visualisation to help requirements elicitation. Uses
the [Mapbox API](https://docs.mapbox.com/api/).

## Development

It's a SPA, but it doesn't use any particular "framework" (e.g.
react/vue/angular). You can still install modules from
[npm](https://www.npmjs.com/package/live-server), then it uses
[browserify](http://browserify.org) to package everything into a single
`static/bundle.js` file which will be loaded by a `<script>` tag in
`index.html`.

To get hacking on it:

- `npm install` all the things
- `npm run build` will build `bundle.js` and exit _or_ `npm run watch` will
  build it, then watch and re-build if you change any of the source files
- then, you just need to set up a local dev server, e.g.
  [this](https://www.npmjs.com/package/live-server)

## Deployment

It's served by GitHub Pages, so any commits that you push to GitHub will be
built & served at <https://act-covid-19-tracker.github.io/geojson-over-time/>.
This means that you need to commit the generated `static/bundle.js` as well (we
might make this nicer in the future, but it'll do for now).

Remember, it's just plain html & js, though---it's not a Jekyll site.

## Licence

Apache 2.0
