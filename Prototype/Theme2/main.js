// window.onload = function () {
//     document.getElementById("autoplay").play();
//  }

const canvas = new fabric.Canvas('canvas', { isDrawingMode: false });

canvas.setBackgroundImage('', canvas.renderAll.bind(canvas));

canvas.freeDrawingBrush.color = 'black';
canvas.freeDrawingBrush.width = 10;

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
