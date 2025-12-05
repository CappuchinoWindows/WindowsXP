const cerrar = document.getElementById("cerrar");

function toggleImagen(){
    if (cerrar.style.display === "flex"){
        cerrar.style.display = "none";
    } else {
        cerrar.style.display = "flex";
    }
}