L.PhotoMarkerMatrix = L.Class.extend({
  initialize: function(config) {
    var levels = [];
    for(var k in config) {
      levels.push(parseInt(k, 10));
    }
    // Sort the levels array numerically
    levels.sort(function(a,b){return(a-b);});
    var m = this.metric = {};
    // Find the highest and lowest zooms we have data for
    m.min = levels[0];
    m.minScale = config[levels[0]];
    m.max = levels[levels.length-1];
    m.maxScale = config[levels[levels.length-1]];
    m.zooms = {};
    var last;
    for(var i = m.min; i <= m.max; i ++) {
      if(config[i]) {
        m.zooms[i] = config[i];
        last = config[i];
      }
      else {
        m.zooms[i] = (last !== undefined) ? last : config[m.max];
      }
    }
  },
  findScale: function(zoom) {
    var m = this.metric,
        z = parseInt(zoom, 10);

    if ( z < m.min ) {
      return m.minScale;
    }
    else if ( z > m.max ) {
      return m.maxScale;
    }
    else {
      return (m.zooms[z] !== undefined) ? m.zooms[z] : m.maxScale;
    }
  }
});

L.PhotoIcon = L.Class.extend({
  options: {
    className: 'leaflet-photomarker-img'
  },

  initialize: function (options) {
    L.setOptions(this, options);
    this.original_size = L.point(options.size);
    this.size = this.original_size;
  },

  scale: function(factor) {
    var to = this.original_size.multiplyBy(factor);
    if ( (to.x !== this.size.x) && (to.y !== this.size.y) ) {
      this.resize(to);
    }
  },

  createIcon: function () {
    var src = this.options.src;

    if (!src) {
      if (name === 'icon') {
        throw new Error("iconUrl not set in Icon options (see the docs).");
      }
      return null;
    }

    this._container = L.DomUtil.create("div", 'leaflet-photomarker-container');
    this._container.style.position = 'relative';
    this.img = this._createImg(src);
    this._container.appendChild(this.img);

    // Add class names
    L.DomUtil.addClass(this.img, 'leaflet-marker-icon');
    L.DomUtil.addClass(this.img, this.options.className);

    // Set size styles
    this._setIconSize(this.img, this.size);

    // return this.img;
    return this._container;
  },

  resize: function(size) {
    this.size = size;
    this._setIconSize(this.img, this.size);
  },

  createShadow: function () {
    return null;
  },

  _setIconSize: function (img, size) {
    var anchor = size.divideBy(2, true);

    if (anchor) {
      img.style.marginLeft = (-anchor.x) + 'px';
      img.style.marginTop  = (-anchor.y) + 'px';
    }

    if (size) {
      img.style.width  = size.x + 'px';
      img.style.height = size.y + 'px';
    }
  },

  _createImg: function (src) {
    var el;

    if (!L.Browser.ie6) {
      el = document.createElement('img');
      el.src = src;
    } else {
      el = document.createElement('div');
      el.style.filter =
              'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
    }
    return el;
  }
});

L.PhotoMarker = L.Marker.extend({
  options: {
    title: '',
    clickable: true,
    draggable: false,
    zIndexOffset: 0,
    opacity: 1,
    riseOnHover: true,
    riseOffset: 250,
    // Default zoom matrix
    matrix: { 11: 0.125, 12: 0.25, 14: 0.5, 16: 1 }
  },
  initialize: function(latlng, options) {
    options.icon = new L.PhotoIcon({src:options.src,size:options.size});
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
    // Only instantiate the matrix here if we're not overriden
    if ( this.matrix === undefined ) {
      this.matrix = new L.PhotoMarkerMatrix(this.options.matrix);
    }
    this.scale( this.matrix.findScale(map.getZoom()) );
  }
});

L.photoMarker = function (latlng, options) {
  return new L.PhotoMarker(latlng, options);
};
