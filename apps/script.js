document.addEventListener("DOMContentLoaded", () => {
    const iconos = document.querySelectorAll(".icono-app");
    const winampIcon = document.querySelector('[data-app="winamp"]');
    const pinballIcon = document.getElementById("pinball-icon");
    const calculadoraIcon = document.querySelector('[data-app="calculadora"]');
    const paintIcon = document.querySelector('[data-app="paint"]');
    
    // Redirección para Winamp
    winampIcon.addEventListener("click", () => {
        window.location.href = "winamp/index.html";
    });
    
    // Redirección para Pinball
    pinballIcon.addEventListener("click", () => {
        window.location.href = "pin/pinball.html";
    });
    
    // Redirección para Calculadora
    calculadoraIcon.addEventListener("click", () => {
        window.location.href = "calculadora/index.html";
    });
    
    // Redirección para Paint
    paintIcon.addEventListener("click", () => {
        window.location.href = "paint/index.html";
    });
});
