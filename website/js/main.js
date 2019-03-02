const $ = jQuery

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  target: 'map',
  view: new ol.View({
    center: [-13585374.543476525694132, 4563668.506573964841664],
    zoom: 13
  })
});


$.getJSON('./data/neighborhoods_OpenLayers_CRS3857.geojson', function(geojsonObject) {
  addLayer(geojsonObject, 'EPSG:3857')
})

$.getJSON('./data/BlockGroups_Census_Simple.json', function(geojsonObject) {
  addLayer(geojsonObject, 'EPSG::2227')
})

function addLayer(geojsonObject, projection) {
  console.log(projection)
  var vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject),
    projection: projection
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  map.addLayer(vectorLayer)
}
