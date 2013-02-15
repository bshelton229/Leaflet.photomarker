var map = L.map('map').setView([43.077085534225475, -89.40519332885742], 13);

var WaitingControl = L.Control.extend({
  onAdd: function(map) {
    var c = L.DomUtil.create('div', 'leaflet-control-attribution');
    c.innerHTML = '<h3>Loading Instagram Images ...</h3>';
    c.style.width = '600px';
    c.style.height = '50px';
    this._container = c;
    return this._container;
  }
});
var waiting_control = new WaitingControl().addTo(map);

// Mapquest open layer
L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors',
    maxZoom: 18,
    minZoom: 13
}).addTo(map);

function popupContent(inst) {
  var full = inst.images.low_resolution;
  // Build the popup content
  var container = L.DomUtil.create("div",'instagram-container');
  var img = L.DomUtil.create('img','instagram-image',container);
  img.src = full.url;
  img.width = full.width;
  img.height = full.height;

  if ( inst.caption && inst.caption.text ) {
    var caption = L.DomUtil.create('p','instagram-caption', container);
    caption.innerHTML = inst.caption.text;
  }
  return container;
}

function resize(e) {
  var photo_marker = e.target,
      zoom = e.zoom;
  // Zoom metric for scaling images
  if ( zoom <= 13 ) {
    photo_marker.scale(0.125);
  }
  else if ( zoom <= 15 ) {
    photo_marker.scale(0.25);
  }
  else if ( zoom < 17 ) {
    photo_marker.scale(0.5);
  }
  else {
    photo_marker.scale(1);
  }
}

// Display the flickr photos
function display(resp) {
  map.removeControl(waiting_control);
  var photo_layer = new L.LayerGroup();
  $.each(resp.data, function(i, inst) {
    var thumbnail = inst.images.thumbnail,
        full = inst.images.low_resolution;
    // Create the photo marker
    var photo_marker = L.photoMarker([inst.location.latitude, inst.location.longitude], {
      src: thumbnail.url,
      size: [ thumbnail.width, thumbnail.height ],
      resize: resize
    }).bindPopup(popupContent(inst));
    photo_layer.addLayer(photo_marker);
  });
  map.addLayer(photo_layer);
}

$.getJSON('https://api.instagram.com/v1/media/search?callback=?', {
  lat: 43.077085534225475,
  lng: -89.40519332885742,
  distance: 5000,
  client_id: '20551ec88e004323b352b320119aa442'
}, display);
