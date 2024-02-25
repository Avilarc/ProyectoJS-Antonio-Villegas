function actualizarHeader() {
    let usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));

    if (usuarioLogeado) {
        document.getElementById("loginDefault").style.display = "none";
        document.getElementById("nombreUsuario").textContent = usuarioLogeado.username;
        document.getElementById("loginUser").style.display = "block";
    } else {
        document.getElementById("loginUser").style.display = "none";
        document.getElementById("loginDefault").style.display = "block";
    }
}