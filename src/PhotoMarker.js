L.PhotoMarker = L.Marker.extend({
  options: {
    title: '',
    clickable: true,
    draggable: false,
    zIndexOffset: 0,
    opacity: 1,
    riseOnHover: true,
    riseOffset: 250
  },
  initialize: function(latlng, options) {
    options.icon = new L.PhotoIcon({src:options.src,size:options.size});
    if ( typeof(options.resize) === 'function' ) {
      this.on('resize', options.resize);
    }
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
    this.fire('resize', { map: this._map, zoom: this._map.getZoom() });
  }
});

L.photoMarker = function (latlng, options) {
  return new L.PhotoMarker(latlng, options);
};
