// jQuery
const $ = jQuery

// General helpers
function getMax(arr) {
  let max = -Infinity
  arr.forEach(function(item) {
    if (item > max) {
      max = item
    }
  })
  return max
}
function getMin(arr) {
  let min = Infinity
  arr.forEach(function(item) {
    if (item < min) {
      min = item
    }
  })
  return min
}
// Color goes from green to red (for 0 to 100)
function getColor(p) {
  var green = p < 50 ? 255 : Math.round(256 - (p - 50) * 5.12);
  var red = p > 50 ? 255 : Math.round((p) * 5.12);
  return "rgb(" + red + "," + green + ",0)";
}

// Init map
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

// Load block groups json
let maxPopDensity = -Infinity
let minPopDensity = Infinity
function setMaxMinPopDensity(json) {
  const popDensities = json.features.map(x => x.properties.PopDensity)
  maxPopDensity = getMax(popDensities)
  minPopDensity = getMin(popDensities)
  if (minPopDensity === null) {
    minPopDensity = 0
  }
}

function addColorValue(json) {
  json.features.forEach(function(feature) {
    const p = feature.properties.PopDensity / (maxPopDensity/2) * 100
    feature.properties.colorValue = p
  })
}

$.getJSON('./data/neighborhoods_OpenLayers_CRS3857.geojson', function(json) {
  addLayer(json, {
    zIndex: 2,
    styleFunction: neighborhoodStyleFunction,
    name: 'neighborhoods'
  })
})
function neighborhoodStyleFunction(feature, resolution) {
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#555',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0)'
    }),
    text: createTextStyle(feature, resolution, '' + feature.get('Name'), '#000')
  });
}
$.getJSON('./data/IntersectionPopulations.geojson', function(json) {
  setMaxMinPopDensity(json)
  addColorValue(json)
  addLayer(json, {
    zIndex: 1,
    styleFunction: mainStyleFunction,
    name: 'populationDensity'
  })
})
function mainStyleFunction(feature, resolution) {
  const p = feature.get('colorValue')
  const color = getColor(p)
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(255, 255, 255, 0)',
      width: 0
    }),
    fill: new ol.style.Fill({
      color: color
    }),
    // text: createTextStyle(feature, resolution, 'Pop:' + feature.get('Tot_Popula') + '\nDen:' + feature.get('PopDensity'), '#000')
    text: createTextStyle(feature, resolution)
  });
}

var createTextStyle = function(feature, resolution, text, color) {
  return new ol.style.Text({
    font: '12px Calibri,sans-serif',
    text: text,
    fill: new ol.style.Fill({
      color: color
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2
    })
  });
};

function addLayer(json, layerConfig) {
  var vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(json)
  });
  var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: layerConfig.styleFunction,
    zIndex: layerConfig.zIndex,
  });
  vectorLayer.set('name', layerConfig.name)
  map.addLayer(vectorLayer)
}

// Toggle functions
function toggleVisibility(layerName) {
  const layers = map.getLayers().getArray()
  const layer = layers.find(x => x.get('name') === layerName)
  const visibility = layer.getVisible()
  layer.setVisible(!visibility)
}
