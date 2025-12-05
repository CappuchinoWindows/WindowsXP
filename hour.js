
function actualizarHora() {
    const clock = document.querySelector(".clock");
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

    clock.textContent = `${horas}:${minutos} ${periodo}`;
}

setInterval(actualizarHora, 1000);

actualizarHora();


const calendar = document.getElementById("calendar-xp");
const monthYear = document.getElementById("month-year");
const calBody = document.getElementById("cal-body-xp");
const todayFooter = document.getElementById("today-xp");

let currentDate = new Date();

document.getElementById("clock-btn").addEventListener("click", () => {
    calendar.classList.toggle("hidden");
    updateCalendar();
});

document.getElementById("prev-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString("en-us", { month: "long" }) + " " + year;

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
            classes += "today-xp ";
        }

        html += `<td class="${classes}" onclick="selectDayXP(this)">${day}</td>`;

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
    document.querySelectorAll(".selected-xp").forEach(el => el.classList.remove("selected-xp"));
    cell.classList.add("selected-xp");
}