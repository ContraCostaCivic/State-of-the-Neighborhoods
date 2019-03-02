const $ = jQuery

$.getJSON('./data/neighborhoods_OpenLayers_CRS3857.geojson', function(geojsonObject) {
  render(geojsonObject)
})

function render(geojsonObject) {
  var vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vectorLayer
    ],
    target: 'map',
    view: new ol.View({
      center: [-13585374.543476525694132, 4563668.506573964841664],
      zoom: 13
    })
  });
}
