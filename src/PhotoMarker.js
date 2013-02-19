L.PhotoMarker = L.Marker.extend({
  options: {
    title: '',
    smallestSizeZoom: 11,
    fullSizeZoom: 16,
    scaleTo: 0.25,
    clickable: true,
    draggable: false,
    zIndexOffset: 0,
    opacity: 1,
    riseOnHover: true,
    riseOffset: 250
  },
  initialize: function(latlng, options) {
    options.icon = new L.PhotoIcon({src:options.src,size:options.size});
    // if ( typeof(options.resize) === 'function' ) {
    //   this.on('resize', options.resize);
    // }
    L.Marker.prototype.initialize.call(this, latlng, options);
  },
  _initIcon: function() {
    L.Marker.prototype._initIcon.call(this);
    this.resize();
  },
  onAdd: function(map) {
    map.on('zoomend', this.resize, this);
    L.Marker.prototype.onAdd.call(this, map);
  },
  onRemove: function(map) {
    map.off('zoomend', this.resize, this);
    L.Marker.prototype.onRemove.call(this, map);
  },
  scale: function(factor) {
    var icon = this.options.icon;
    icon.scale(factor);
  },
  resize: function() {
    if ( typeof(this.options.resize) === 'function' ) {
      this.options.resize.call(this,this._map);
    }
    else {
      this._resize(this._map);
    }
  },
  _resize: function(map) {
    var marker = this,
        zoom = map.getZoom(),
        min = this.options.smallestSizeZoom,
        max = this.options.fullSizeZoom,
        scaleTo = this.options.scaleTo,
        level = max - zoom,
        levels = max - min;

    if ( zoom >= max ) {
      marker.scale(1);
    }
    else if ( zoom < min ) {
      marker.scale(scaleTo);
    }
    else {
      var scale = 1 - ( ( 1 - scaleTo ) / levels * level );
      marker.scale(scale);
    }
  }
});

L.photoMarker = function (latlng, options) {
  return new L.PhotoMarker(latlng, options);
};
