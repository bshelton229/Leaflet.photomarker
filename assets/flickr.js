var map = L.map('map').setView([43.077085534225475, -89.40519332885742], 16);

// Mapquest open layer
L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors',
    maxZoom: 18,
    minZoom: 13
}).addTo(map);

// Display the flickr photos
function display(resp) {
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
      });
      photo_markers.addLayer(photo_marker);
    });
    map.addLayer(photo_markers);
  }
}

$.getJSON('http://api.flickr.com/services/rest/?jsoncallback=?', {
  method: 'flickr.photos.search',
  api_key: 'c375f1e26e8b14300d2945a0fd6c4e8e',
  bbox: '-89.44210052490234,43.0527084803254,-89.36056137084961,43.09847605187662',
  min_taken_date: Date.now() - ( 24 * 60 * 60 * 60 ),
  extras: 'description,license,date_upload,date_taken,owner_name,icon_server,original_format,last_update,geo,tags,machine_tags,o_dims,views,media,path_alias,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o',
  format: 'json'
}, display);
