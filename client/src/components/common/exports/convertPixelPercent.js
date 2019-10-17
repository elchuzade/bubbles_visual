export const PixelToPercent = (coordinateOne, screenSize) => {
  return (coordinateOne * 100) / screenSize;
};

export const PercentToPixel = (coordinateOne, screenSize) => {
  return (coordinateOne * screenSize) / 100;
};
