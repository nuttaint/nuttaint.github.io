// window.onload = function () {
//     document.getElementById("autoplay").play();
//  }

document.getElementById("play").addEventListener("click", myFunction);
function myFunction() {
    document.getElementById("play").disabled = true;
}

// time = 1;
// interval = setInterval(function () {
//     time--;
//     if (time == 0) {
//         // stop timer
//         clearInterval(interval);
//         // click
//         document.getElementById('play').click();
//     }
// }, 2000)




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