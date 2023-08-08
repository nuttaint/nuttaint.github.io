$force = document.querySelectorAll('#force')[0];
const $touches = document.querySelectorAll('#touches')[0];
const fabricCanvas = new fabric.Canvas('canvas', { isDrawingMode: false });
fabricCanvas.setBackgroundImage('', fabricCanvas.renderAll.bind(fabricCanvas));

let lineWidth = 0 ;
let isMousedown = false;
let points = [];

fabricCanvas.width = window.innerWidth * 2;
fabricCanvas.height = window.innerHeight * 2;

const strokeHistory = [];

const requestIdleCallback = window.requestIdleCallback || function (fn) { setTimeout(fn, 1) };

fabricCanvas.freeDrawingBrush.color = 'black';
fabricCanvas.freeDrawingBrush.width = 7;

fabricCanvas.isDrawingMode = !fabricCanvas.isDrawingMode;

function drawOnCanvas(points) {
  for (let i = 1; i < points.length; i++) {
    const startPoint = points[i - 1];
    const endPoint = points[i];
    drawLine(startPoint, endPoint);
  }
}

fabricCanvas.on('mouse:down', function (e) {
  isMousedown = true;
  points.push({ x: e.e.pageX * 2, y: e.e.pageY * 2 , lineWidth });
});

fabricCanvas.on('touch:gesture', function (e) {
  isMousedown = true;
  const touch = e.e.touches[0];
  points.push({ x: touch.pageX * 2, y: touch.pageY * 2 , lineWidth});
});

function countTouches(array) {
  let count = 0;
  for (const _ of array) {
    count++;
  }
  return count;
}
for (const ev of ['touchmove', 'mousemove']) {
  canvas.addEventListener(ev, function (e) {
    if (!isMousedown) return;
    e.preventDefault();

    let pressure = 0.1;
    let x, y;

    if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"];
      }
      x = e.touches[0].pageX * 2;
      y = e.touches[0].pageY * 2;
    } else {
      pressure = 1.0;
      x = e.pageX * 2;
      y = e.pageY * 2;
    }

    // smoothen line width
    lineWidth = Math.log(pressure + 1) * 40 * 0.2 + lineWidth * 0.8;
    points.push({ x, y , lineWidth});

    drawOnCanvas(points);

    requestIdleCallback(() => {
      $force.textContent = 'force = ' + pressure;

      if (e.touches) {
        const touch = e.touches[0];
        if (touch) {
          // Log the touch parameters to the console
          console.log('Touch parameters:', {
            rotationAngle: touch.rotationAngle,
            altitudeAngle: touch.altitudeAngle,
            azimuthAngle: touch.azimuthAngle,
          });
        } else {
          console.log('No touch parameters available.');
        }
      } else {
        console.log('Not a touch event.');
      }
    });
  });
}

fabricCanvas.on('mouse:move', function (e) {
  if (!isMousedown) return;

  const x = e.e.pageX * 2;
  const y = e.e.pageY * 2;

  points.push({ x, y , lineWidth});
  drawOnCanvas(points);
});

fabricCanvas.on('touch:drag', function (e) {
  if (!isMousedown) return
  e.preventDefault()

  let pressure = 0.1
  let x, y
  if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
    if (e.touches[0]["force"] > 0) {
      pressure = e.touches[0]["force"]
    }
    x = e.touches[0].pageX * 2
    y = e.touches[0].pageY * 2
  } else {
    pressure = 1.0
    x = e.pageX * 2
    y = e.pageY * 2
  }

  // smoothen line width
  lineWidth = (Math.log(pressure + 1) * 40 * 0.2 + lineWidth * 0.8)
  points.push({ x, y , lineWidth})

  drawOnCanvas(points);

  requestIdleCallback(() => {
    $force.textContent = 'force = ' + pressure

    const touch = e.touches ? e.touches[0] : null
    if (touch) {
      $touches.innerHTML = `
        rotationAngle = ${touch.rotationAngle} <br/>
        altitudeAngle = ${touch.altitudeAngle} <br/>
        azimuthAngle = ${touch.azimuthAngle} <br/>
      `
    }
  })
})

fabricCanvas.on('mouse:up', function (e) {
  isMousedown = false;

  requestIdleCallback(function () {
    const numTouches = countTouches(points); // Count the number of touches
    strokeHistory.push([...points]); // Add the current touch data array to the strokeHistory
    points = [];
    sendDataToServer(numTouches); // Call the sendDataToServer function with the number of touches
    resetStrokeHistory(); // Reset the stroke history after sending data
  });


});
function drawLine(start, end) {
  fabricCanvas.getContext().beginPath();
  fabricCanvas.getContext().moveTo(start.x, start.y);
  fabricCanvas.getContext().lineTo(end.x, end.y);
  fabricCanvas.getContext().lineWidth = end.lineWidth;
  fabricCanvas.getContext().strokeStyle = 'black';
  fabricCanvas.getContext().lineCap = 'round';
  fabricCanvas.getContext().stroke();
  fabricCanvas.getContext().closePath();
}

// Function to reset the stroke history array
function resetStrokeHistory() {
  strokeHistory.splice(0, strokeHistory.length);
}


function sendDataToServer(numTouches) {
  // Convert the points object into an array of objects with additional touch parameters
  const touchDataArrayWithParameters = strokeHistory.flat().map(point => ({
    ...point,
    rotationAngle: 0,
    altitudeAngle: 0,
    azimuthAngle: 0,
  }));
  console.log('Stroke history from canvas with parameters:', touchDataArrayWithParameters);
  console.log('Number of touches:', numTouches);
  // Replace the URL with the server endpoint where you want to send the data
  fetch('http://localhost:3000/api/pencil', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(touchDataArrayWithParameters), // Send the entire stroke history with parameters to the server
  })
    .then((response) => {
      console.log('Data sent to the server');
    })
    .catch((error) => {
      console.error('Error sending data to the server:', error);
    });
}