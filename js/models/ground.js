define(['vendor/collie'], function (collie) {
  var Ground = function (x, y, width, height, layer) {
    this.displayObject = new collie.DisplayObject({
      x: x,
      y: y,
      width: width,
      height: height,
      backgroundColor: '#0D2622'
    }).addTo(layer);
  };

  return Ground;
});
