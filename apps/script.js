/* ------------------------------------------------
   CONTROL DE ICONOS PARA ABRIR APLICACIONES (XP)
--------------------------------------------------*/

document.addEventListener("DOMContentLoaded", () => {
    const winampIcon = document.querySelector('[data-app="winamp"]');
    const pinballIcon = document.querySelector('[data-app="pinball"]');
    const calculadoraIcon = document.querySelector('[data-app="calculadora"]');
    const paintIcon = document.querySelector('[data-app="paint"]');
    const buscaminasIcon = document.querySelector('[data-app="buscaminas"]');
    const papeleraIcon = document.querySelector('[data-app = "papelera"]');
    const notedpadIcon = document.querySelector('[data-app = "notepad"]');


    const ventana = document.getElementById("ventana-app");
    const titulo = document.getElementById("ventana-titulo");
    const contenido = document.getElementById("app-contenido");
    const btnCerrar = document.getElementById("cerrar-ventana");

    // Cerrar ventana
    btnCerrar.onclick = () => {
        ventana.classList.add("hidden");
        contenido.innerHTML = "";
    };

    // Abrir aplicaciones normales
    winampIcon.onclick = () => window.location.href = "winamp/index.html";
    pinballIcon.onclick = () => window.location.href = "pin/pinball.html";
    calculadoraIcon.onclick = () => window.location.href = "calculadora/index.html";
    paintIcon.onclick = () => window.location.href = "paint/index.html";
    papeleraIcon.onclick = () => window.location.href = "papelera/index.html";
    notedpadIcon.onclick = () => window.location.href = "notepad/index.html";
    // Abrir Buscaminas dentro de la ventana XP
    buscaminasIcon.onclick = () => abrirBuscaminas();

    function abrirBuscaminas() {
        titulo.textContent = "Buscaminas";
        ventana.classList.remove("hidden");

        contenido.innerHTML = `
            <div id="buscaminas">
                <div class="buscaminas-header">
                    <div class="contador" id="minas-restantes">010</div>
                    <div class="cara" id="reinicio-cara">😊</div>
                    <div class="contador" id="tiempo">000</div>
                </div>
                <div id="tablero"></div>
            </div>
        `;

        iniciarBuscaminas();
    }
});


/* ------------------------------------------------
   JUEGO BUSCAMINAS (ADAPTADO A LA VENTANA XP)
--------------------------------------------------*/

function iniciarBuscaminas() {

    // Selectores dentro de la ventana XP
    const tableroDiv = document.getElementById("tablero");
    const cara = document.getElementById("reinicio-cara");
    const minasRestantesDiv = document.getElementById("minas-restantes");

    // Configuración
    let filas = 9;
    let columnas = 9;
    let minas = 10;

    let tablero = [];

    minasRestantesDiv.textContent = minas.toString().padStart(3, "0");

    cara.onclick = iniciarJuego;

    iniciarJuego();

    function iniciarJuego() {

        tableroDiv.innerHTML = "";
        tablero = [];
        cara.textContent = "😊";

        tableroDiv.style.gridTemplateColumns = `repeat(${columnas}, 30px)`;

        // Crear tablero vacío
        for (let i = 0; i < filas; i++) {
            tablero[i] = [];
            for (let j = 0; j < columnas; j++) {
                tablero[i][j] = { mina: false, numero: 0, revelada: false };
            }
        }

        // Colocar minas
        let colocadas = 0;
        while (colocadas < minas) {
            let x = Math.floor(Math.random() * filas);
            let y = Math.floor(Math.random() * columnas);
            if (!tablero[x][y].mina) {
                tablero[x][y].mina = true;
                colocadas++;
            }
        }

        // Calcular números
        for (let x = 0; x < filas; x++) {
            for (let y = 0; y < columnas; y++) {
                if (!tablero[x][y].mina) {
                    tablero[x][y].numero = contarMinas(x, y);
                }
            }
        }

        // Crear celdas
        for (let x = 0; x < filas; x++) {
            for (let y = 0; y < columnas; y++) {
                const celda = document.createElement("div");
                celda.classList.add("celda");
                celda.onclick = () => revelar(x, y, celda);
                tableroDiv.appendChild(celda);
            }
        }
    }

    function contarMinas(x, y) {
        let total = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (tablero[x + i]?.[y + j]?.mina) total++;
            }
        }
        return total;
    }

    function revelar(x, y, celda) {
        if (tablero[x][y].revelada) return;

        tablero[x][y].revelada = true;
        celda.classList.add("revelada");

        if (tablero[x][y].mina) {
            celda.textContent = "💣";
            cara.textContent = "💀";
            revelarTodo();
            return;
        }

        const n = tablero[x][y].numero;

        if (n > 0) {
            celda.textContent = n;
            celda.classList.add(`c${n}`);
        } else {
            // Revelar vacíos en cascada
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nx = x + i;
                    let ny = y + j;
                    let c = tableroDiv.children[nx * columnas + ny];
                    if (c && !tablero[nx]?.[ny]?.revelada) revelar(nx, ny, c);
                }
            }
        }
    }

    function revelarTodo() {
        for (let x = 0; x < filas; x++) {
            for (let y = 0; y < columnas; y++) {
                let celda = tableroDiv.children[x * columnas + y];
                if (tablero[x][y].mina) celda.textContent = "💣";
            }
        }
    }
}
