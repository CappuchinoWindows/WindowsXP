const tablero = document.getElementById("tablero");
const turnoTexto = document.getElementById("turno");

let turno = "roja";
let seleccionada = null;
let debeSeguirComiendo = false;

function crearTablero() {
    tablero.innerHTML = "";
    for (let f = 0; f < 8; f++) {
        for (let c = 0; c < 8; c++) {
            const casilla = document.createElement("div");
            casilla.className = "casilla " + ((f + c) % 2 === 0 ? "blanca" : "negra");
            casilla.dataset.fila = f;
            casilla.dataset.col = c;

            if ((f + c) % 2 !== 0) {
                if (f < 3) agregarPieza(casilla, "negra");
                if (f > 4) agregarPieza(casilla, "roja");
            }

            casilla.addEventListener("click", () => clickCasilla(casilla));
            tablero.appendChild(casilla);
        }
    }
}

function agregarPieza(casilla, color) {
    const p = document.createElement("div");
    p.className = "pieza " + (color === "roja" ? "roja" : "negra-pieza");
    p.dataset.color = color;
    p.dataset.dama = "false";
    casilla.appendChild(p);
}

function clickCasilla(casilla) {
    const pieza = casilla.querySelector(".pieza");

    if (pieza && pieza.dataset.color === turno) {
        if (seleccionada) seleccionada.classList.remove("seleccionada");
        seleccionada = pieza;
        pieza.classList.add("seleccionada");
        return;
    }

    if (seleccionada && !pieza && casilla.classList.contains("negra")) {
        intentarMover(casilla);
    }
}

function intentarMover(destino) {
    const origen = seleccionada.parentElement;
    const fO = +origen.dataset.fila;
    const cO = +origen.dataset.col;
    const fD = +destino.dataset.fila;
    const cD = +destino.dataset.col;

    const dama = seleccionada.dataset.dama === "true";
    const dirs = dama
        ? [[1,1],[1,-1],[-1,1],[-1,-1]]
        : [[turno === "roja" ? -1 : 1, 1], [turno === "roja" ? -1 : 1, -1]];

    for (let [df, dc] of dirs) {
        if (!debeSeguirComiendo && fD === fO + df && cD === cO + dc) {
            mover(destino);
            cambiarTurno();
            return;
        }

        if (fD === fO + df * 2 && cD === cO + dc * 2) {
            const medio = document.querySelector(
                `.casilla[data-fila="${fO+df}"][data-col="${cO+dc}"]`
            );
            const piezaMedia = medio?.querySelector(".pieza");

            if (piezaMedia && piezaMedia.dataset.color !== turno) {
                piezaMedia.remove();
                mover(destino);

                if (puedeSeguirComiendo(destino)) {
                    debeSeguirComiendo = true;
                    seleccionada.classList.add("seleccionada");
                } else {
                    debeSeguirComiendo = false;
                    cambiarTurno();
                }
                return;
            }
        }
    }
}

function mover(destino) {
    destino.appendChild(seleccionada);
    seleccionada.classList.remove("seleccionada");
    coronar(seleccionada, destino);
}

function coronar(pieza, casilla) {
    const fila = +casilla.dataset.fila;
    if (
        (pieza.dataset.color === "roja" && fila === 0) ||
        (pieza.dataset.color === "negra" && fila === 7)
    ) {
        pieza.dataset.dama = "true";
        pieza.classList.add("dama");
    }
}

function puedeSeguirComiendo(casilla) {
    const pieza = casilla.querySelector(".pieza");
    const fO = +casilla.dataset.fila;
    const cO = +casilla.dataset.col;
    const dama = pieza.dataset.dama === "true";

    const dirs = dama
        ? [[1,1],[1,-1],[-1,1],[-1,-1]]
        : [[turno === "roja" ? -1 : 1, 1], [turno === "roja" ? -1 : 1, -1]];

    for (let [df, dc] of dirs) {
        const medio = document.querySelector(
            `.casilla[data-fila="${fO+df}"][data-col="${cO+dc}"]`
        );
        const destino = document.querySelector(
            `.casilla[data-fila="${fO+df*2}"][data-col="${cO+dc*2}"]`
        );

        if (
            medio && destino &&
            medio.querySelector(".pieza") &&
            medio.querySelector(".pieza").dataset.color !== turno &&
            !destino.querySelector(".pieza")
        ) return true;
    }
    return false;
}

function cambiarTurno() {
    seleccionada = null;
    turno = turno === "roja" ? "negra" : "roja";
    turnoTexto.textContent = "Turno: " + (turno === "roja" ? "Rojas" : "Negras");
}

crearTablero();
