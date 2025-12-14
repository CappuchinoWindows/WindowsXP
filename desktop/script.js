// Redirección al hacer clic en el icono de aplicaciones
document.addEventListener("DOMContentLoaded", () => {
    const appsIcon = document.getElementById("apps-icon");
    
    if (appsIcon) {
        appsIcon.addEventListener("click", () => {
            window.location.href = "../apps/index.html";
        });
    }
});

// Toggle del menú Inicio
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("boton_inicio");
    const cerrar = document.getElementById("cerrar");
    
    boton.addEventListener("click", () => {
        if (!cerrar) return;
        cerrar.style.display = (cerrar.style.display === "flex") ? "none" : "flex";
    });
});

// Cerrar Clippy
document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("clippy-close");
    const clippyContainer = document.getElementById("clippy-container");
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            clippyContainer.style.display = "none";
        });
    }
});

// Actualizar reloj
function actualizarHora() {
    const reloj = document.querySelector(".reloj");
    const ahora = new Date();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let periodo;
    
    if (horas >= 12) {
        periodo = "p. m.";
    } else {
        periodo = "a. m.";
    }
    
    if (horas === 0) {
        horas = 12;
    } else if (horas > 12) {
        horas = horas - 12;
    }
    
    minutos = minutos.toString().padStart(2, "0");
    reloj.textContent = `${horas}:${minutos} ${periodo}`;
}

setInterval(actualizarHora, 1000);
actualizarHora();

// Calendario
const calendar = document.getElementById("calendario");
const monthYear = document.getElementById("mes_año");
const calBody = document.getElementById("estructura_calendario");
const todayFooter = document.getElementById("hoy");
let currentDate = new Date();

document.getElementById("boton_reloj").addEventListener("click", () => {
    calendar.classList.toggle("hidden");
    updateCalendar();
});

document.getElementById("mes_anterior").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

document.getElementById("mes_siguiente").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthYear.textContent = currentDate.toLocaleString("es-mx", { month: "long" }) + " " + year;
    
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDay === 0 ? 7 : firstDay) - 1;
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    let html = "";
    let day = 1;
    
    for (let i = 0; i < 6; i++) {
        html += "<tr>";
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < adjustedFirstDay) {
                html += "<td></td>";
            } else if (day > lastDay) {
                html += "<td></td>";
            } else {
                const today = new Date();
                const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
                html += `<td class="${isToday ? 'hoy' : ''}">${day}</td>`;
                day++;
            }
        }
        html += "</tr>";
        if (day > lastDay) break;
    }
    
    calBody.innerHTML = html;
    
    const hoy = new Date();
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    todayFooter.textContent = `Hoy: ${dias[hoy.getDay()]}, ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;
}
