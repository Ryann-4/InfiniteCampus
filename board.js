const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraser");
const clearBtn = document.getElementById("clear");
let drawing = false;
let isErasing = false;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", e => startDrawing(e.touches[0]));
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);
canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    draw(e.touches[0]);
});
function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
}
function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}
function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = isErasing ? "#ffffff" : colorPicker.value;
    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
}
function getX(e) {
    return e.clientX - canvas.getBoundingClientRect().left;
}
function getY(e) {
    return e.clientY - canvas.getBoundingClientRect().top;
}
eraserBtn.addEventListener("click", () => {
    isErasing = !isErasing;
    eraserBtn.textContent = isErasing ? "Drawing Mode" : "Eraser";
});
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});