// Helper node script to parse data.json into something for the photo layer
// Data json comes from a flickr API response
var fs = require("fs"),
    photos = JSON.parse(fs.readFileSync('data.json', 'utf8')),
    out = [];

photos.forEach(function(photo) {
  out.push({
    src: photo.url_t,
    size: [photo.width_t,photo.height_t],
    latLng: [ photo.latitude, photo.longitude ],
    medium: photo.url_m,
    medium_size: [photo.width_m,photo.height_m],
    title: photo.title
  });
});

fs.writeFileSync('photos.json', JSON.stringify(out));
