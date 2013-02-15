describe('L.PhotoMarker', function() {
  it('Should be able to scale an icon', function() {
    // Mock up a map
    var map = L.map(document.createElement('div')).setView([43.077085534225475, -89.40519332885742], 16);
    // Create a photo marker
    var marker = L.photoMarker([43.077085534225475, -89.40519332885742], {
      src: 'http://farm8.staticflickr.com/7012/6477800239_ee93da89b9_t.jpg',
      size: [100,67]
    }).addTo(map);
    var img = marker._icon;
    expect(img.style.width).toEqual('100px');
    expect(img.style.height).toEqual('67px');
    marker.scale(2);
    expect(img.style.width).toEqual('200px');
    expect(img.style.height).toEqual('134px');
  });
});
