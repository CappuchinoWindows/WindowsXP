document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("boton_inicio");
    const cerrar = document.getElementById("cerrar");

    boton.addEventListener("click", () => {
        if (!cerrar) return;

        cerrar.style.display = (cerrar.style.display === "flex") ? "none" : "flex";
    });
});


// Referencias correctas
// const contenedor = document.getElementById("buscaminas-contenedor");
// const tableroDiv = document.getElementById("tablero");
// const cara = document.getElementById("reinicio-cara");

// Mostrar / Ocultar Buscaminas
// function toggleBuscaminas() {
//     const cont = document.getElementById("buscaminas-contenedor");

//     cont.classList.toggle("buscaminas-oculto");

//     if (!cont.classList.contains("buscaminas-oculto")) {
//         cont.style.display = "flex";   // se muestra
//         iniciarJuego();               // crea el tablero
//     } else {
//         cont.style.display = "none";  // se oculta
//     }
// }


// // Tamaño del tablero
// let filas = 9;
// let columnas = 9;
// let minas = 10;

// let tablero = [];
// let reveladas = 0;

// document.getElementById("minas-restantes").textContent = minas.toString().padStart(3,"0");

// // Reiniciar
// cara.onclick = iniciarJuego;

// // Iniciar juego
// function iniciarJuego() {
//     tableroDiv.innerHTML = "";
//     tablero = [];
//     reveladas = 0;
//     cara.textContent = "🙂";

//     tableroDiv.style.gridTemplateColumns = `repeat(${columnas}, 30px)`;

//     for (let i = 0; i < filas; i++) {
//         tablero[i] = [];
//         for (let j = 0; j < columnas; j++) {
//             tablero[i][j] = { mina: false, numero: 0, revelada: false };
//         }
//     }

//     let colocadas = 0;
//     while (colocadas < minas) {
//         let x = Math.floor(Math.random() * filas);
//         let y = Math.floor(Math.random() * columnas);
//         if (!tablero[x][y].mina) {
//             tablero[x][y].mina = true;
//             colocadas++;
//         }
//     }

//     for (let x = 0; x < filas; x++) {
//         for (let y = 0; y < columnas; y++) {
//             if (!tablero[x][y].mina) {
//                 tablero[x][y].numero = contarMinas(x, y);
//             }
//         }
//     }

//     for (let x = 0; x < filas; x++) {
//         for (let y = 0; y < columnas; y++) {
//             const celda = document.createElement("div");
//             celda.classList.add("celda");
//             celda.onclick = () => revelar(x, y, celda);
//             tableroDiv.appendChild(celda);
//         }
//     }
// }

// function contarMinas(x, y) {
//     let total = 0;
//     for (let i = -1; i <= 1; i++) {
//         for (let j = -1; j <= 1; j++) {
//             if (tablero[x+i]?.[y+j]?.mina) total++;
//         }
//     }
//     return total;
// }

// function revelar(x, y, celda) {
//     if (tablero[x][y].revelada) return;

//     tablero[x][y].revelada = true;
//     celda.classList.add("revelada");

//     if (tablero[x][y].mina) {
//         celda.textContent = "💣";
//         cara.textContent = "💀";
//         revelarTodo();
//         return;
//     }

//     const n = tablero[x][y].numero;
//     if (n > 0) {
//         celda.textContent = n;
//         celda.classList.add(`c${n}`);
//     } else {
//         for (let i = -1; i <= 1; i++) {
//             for (let j = -1; j <= 1; j++) {
//                 let nx = x + i;
//                 let ny = y + j;
//                 let c = tableroDiv.children[nx * columnas + ny];
//                 if (c && !tablero[nx]?.[ny]?.revelada) revelar(nx, ny, c);
//             }
//         }
//     }
// }

// function revelarTodo() {
//     for (let x = 0; x < filas; x++) {
//         for (let y = 0; y < columnas; y++) {
//             let celda = tableroDiv.children[x * columnas + y];
//             if (tablero[x][y].mina) celda.textContent = "💣";
//         }
//     }
// }
