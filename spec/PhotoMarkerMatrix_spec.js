describe('PhotoMarkerMatrix', function() {
  it('Should be able to find intermediate scales', function() {
    var matrix = new L.PhotoMarkerMatrix({
      13: .25,
      16: 1
    });
    expect( matrix.findScale(17) ).toEqual( 1 );
  });

  it('Should be able to find higher than min scales', function() {
    var matrix = new L.PhotoMarkerMatrix({
      13: .25,
      16: 1
    });
    expect( matrix.findScale(12) ).toEqual( .25 );
  });
});
