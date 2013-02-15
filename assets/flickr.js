var map = L.map('map').setView([43.077085534225475, -89.40519332885742], 13);

var WaitingControl = L.Control.extend({
  onAdd: function(map) {
    var c = L.DomUtil.create('div', 'leaflet-control-attribution');
    c.innerHTML = '<h3>Loading Flickr Images ...</h3>';
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

function popupContent(photo) {
  var c = L.DomUtil.create('div', 'flickr-popup');
  var img = L.DomUtil.create('img', 'flickr-popup-img', c);
  img.src = photo.url_m;
  img.style.width = photo.width_m;
  img.style.height = photo.height_m;
  img.alt = photo.title;
  var desc = L.DomUtil.create('p', 'flickr-popup-description', c);
  desc.innerHTML = photo.title;
  if ( photo.ownername ) {
    desc.innerHTML += ' ('+photo.ownername+')';
  }
  return c;
}

// Display the flickr photos
function display(resp) {
  map.removeControl(waiting_control);
  if ( resp.photos && resp.photos.photo ) {
    $("#loading").hide();
    // Marker Cluster group
    var photo_markers = new L.MarkerClusterGroup({
      showCoverageOnHover: false,
      spiderfyDistanceMultiplier: 5,
      maxClusterRadius: 50
    });

    $.each(resp.photos.photo, function(k, photo) {
      // Create a photo marker
      var photo_marker = L.photoMarker([photo.latitude, photo.longitude], {
        src: photo.url_t,
        size: [ photo.width_t, photo.height_t ],
        resize: function(e) {
          var zoom = e.zoom,
              marker = e.target;
          if ( zoom <= 15 ) {
            marker.scale(0.25);
          }
          else {
            marker.scale(1);
          }
        }
      }).bindPopup(popupContent(photo), { minWidth: photo.width_m });
      photo_markers.addLayer(photo_marker);
    });
    map.addLayer(photo_markers);
  }
}

// Retrieve the flickr photos
$.getJSON('http://api.flickr.com/services/rest/?jsoncallback=?', {
  method: 'flickr.photos.search',
  api_key: 'c375f1e26e8b14300d2945a0fd6c4e8e',
  bbox: '-89.44210052490234,43.0527084803254,-89.36056137084961,43.09847605187662',
  min_taken_date: Date.now() - ( 24 * 60 * 60 * 60 ),
  extras: 'description,license,owner_name,geo,o_dims,media,path_alias,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o',
  format: 'json'
}, display);
