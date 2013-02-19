Leaflet.PhotoMarker
===================

L.PhotoMarker is a [Leaflet](http://leafletjs.com) image marker. It takes src and size options,
and displays the image as the marker icon.

[Example pulling from the Flickr API](http://bshelton229.github.com/Leaflet.photomarker/)

*Requires Leaflet 0.5.0 or newer*

## Adding a photo marker

```javascript
var photo_marker = new L.PhotoMarker([43.077085534225475, -89.40519332885742], {
  src: 'http://farm8.staticflickr.com/7012/6477800239_ee93da89b9_t.jpg',
  size: [ 100, 67 ]
}).addTo(map);
```

## Scaling the photo at different zoom levels

The photo marker has a scale() method and fires a resize event when the map is zoomed,
allowing you to manually change the scale at different zoom levels.

**TODO: Think about an automatic algorithm for handling the size per zoom level.**

```javascript
var photo_marker = new L.PhotoMarker([43.077085534225475, -89.40519332885742], {
  src: 'http://farm8.staticflickr.com/7012/6477800239_ee93da89b9_t.jpg',
  size: [ 100, 67 ],
  resize: function(e) {
    var zoom = e.zoom,
        photo_marker = e.target;
    if ( zoom <= 13 ) {
      photo_marker.scale(0.25);
    }
    else if (zoom <= 15 ) {
      // Half of the size option
      photo_marker.scale(0.5);
    }
    else {
      // Scale 1 is 100% as defined in the size option
      photo_marker.scale(1);
    }
  }
}).addTo(map);
```
