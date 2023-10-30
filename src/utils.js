export const orderItems = (list) => {
  return list.sort((a, b) => a.displayOrder - b.displayOrder);
};

export const startDraw = (context, x, y) => {
  context.beginPath();
  context.moveTo(x, y);
};

export const drawLine = (context, x, y) => {
  context.lineTo(x, y);
  context.stroke();
};

export const changeSettings = (context, color, size) => {
  context.strokeStyle = color;
  context.lineWidth = size;
};

export const onDownloadCanvas = (document, canvas) => {
  const anchor = document.createElement("a");
  anchor.href = canvas.toDataURL();
  anchor.download = "drawing.jpg";
  anchor.click();
};
