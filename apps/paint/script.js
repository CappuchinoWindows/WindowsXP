// Obtener el lienzo y el contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Variables de estado
let drawing = false;
let currentTool = 'pencil';  // Herramienta por defecto
let currentColor = '#000000';  // Color por defecto

// Tamaño del lienzo
canvas.width = 800;
canvas.height = 400;

// Cambiar el color de fondo del lienzo a blanco solo una vez al cargar
ctx.fillStyle = '#ffffff';  // Color de fondo blanco
ctx.fillRect(0, 0, canvas.width, canvas.height); // Rellenar el lienzo con blanco

// Función para comenzar a dibujar
function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// Función para dibujar en el lienzo
function draw(event) {
    if (!drawing) return;

    // Si estamos usando el borrador, el color debe ser blanco (o del fondo)
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;  // Color blanco para el borrador
    ctx.lineWidth = currentTool === 'eraser' ? 10 : 2;  // El borrador será más grande (10px)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

// Función para dejar de dibujar
function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

// Cambiar color con el selector de color
document.getElementById("color").addEventListener("input", (event) => {
    currentColor = event.target.value;
});

// Cambiar herramienta a Pincel
document.getElementById("btn-pencil").addEventListener("click", () => {
    currentTool = 'pencil';
    // Establecer el color al del selector
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;  // Pincel con grosor de 2px
    // Cambiar el cursor a la flecha normal
    canvas.style.cursor = 'default';
});

// Cambiar herramienta a Borrador
document.getElementById("btn-eraser").addEventListener("click", () => {
    currentTool = 'eraser';
    // El color del borrador es blanco
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = (25);  // Aumentar el tamaño del borrador para mayor precisión
    // Cambiar el cursor a un estilo de borrador
    canvas.style.cursor = 'url("https://cdn-icons-png.flaticon.com/512/134/134560.png") 10 10, auto';  // Borrador de imagen (ajustado)
});

// Eventos de lienzo
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);


