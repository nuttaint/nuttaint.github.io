// Remove the duplicate declaration of const canvas = new fabric.Canvas('canvas', { isDrawingMode: false });

// Function to send drawing data to the server
function sendDrawingDataToServer(points) {
    const requestBody = {
      x: points.map(point => point.x),
      y: points.map(point => point.y),
      lineWidth: points.map(point => point.lineWidth),
    };
  
    fetch('/api/saveDrawing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Drawing data saved on the server:', data);
      })
      .catch(error => {
        console.error('Failed to save drawing data:', error);
      });
  }
  
  // Event listener for when the drawing is completed
  canvas.on('path:created', function (e) {
    const path = e.path;
    const drawingPoints = path.path.map(point => ({
      x: point[1],
      y: point[2],
      lineWidth: path.strokeWidth,
    }));
  
    sendDrawingDataToServer(drawingPoints);
  });
  
  // The rest of your code related to canvas
  const canvas = new fabric.Canvas('canvas', { isDrawingMode: false });
  
  canvas.setBackgroundImage('', canvas.renderAll.bind(canvas));
  
  canvas.freeDrawingBrush.color = 'black';
  canvas.freeDrawingBrush.width = 7;
  
  canvas.isDrawingMode = !canvas.isDrawingMode;
  
  $('#remove').on('click', function () {
    canvas.isDrawingMode = false;
    canvas.remove(canvas.getActiveObject());
  });
  
  canvas.on('selection:created', function () {
    $('#remove').prop('disabled', '');
  });
  
  canvas.on('selection:cleared', function () {
    $('#remove').prop('disabled', 'disabled');
  });
  
  