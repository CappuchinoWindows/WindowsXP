document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("clippy-close");
    const clippyContainer = document.getElementById("clippy-container");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            clippyContainer.style.display = "none";
        });
    }
});

document.getElementById("boton_inicio").addEventListener("click", () => {
    window.location.href = "PONER AQUI LINK PAGINA DEL SISTEMA OPERATIVO";
});

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

    let html = "<tr>";

    for (let i = 0; i < adjustedFirstDay; i++) {
        html += "<td></td>";
    }

    for (let day = 1; day <= lastDay; day++) {
        const d = new Date(year, month, day);
        const today = new Date();

        let classes = "";

        if (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        ) {
            classes += "hoy";
        }

        html += `<td class="${classes}" onclick="dia_elegido">${day}</td>`;

        if (d.getDay() === 0) {
            html += "</tr><tr>";
        }
    }

    html += "</tr>";
    calBody.innerHTML = html;

    const now = new Date();
    todayFooter.textContent =
        now.getDate().toString().padStart(2, "0") +
        "/" +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        now.getFullYear();
}

function selectDayXP(cell) {
    document.querySelectorAll(".dia_elegido").forEach(el => el.classList.remove("dia_elegido"));
    cell.classList.add("dia_elegido");
}