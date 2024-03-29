//funciones
async function obtenerUsuariosDefault() {
    try {
        let response = await fetch('https://fakestoreapi.com/users');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let usuarios = await response.json();
        return usuarios;
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
    }
}

function validarCampo(campo) {
    try {
        if (campo.value.trim() === '') {
            campo.classList.add("invalido");
            return false;
        } else {
            campo.classList.remove("invalido");
            return true;
        }
    } catch (error) {
        console.error('Error validando campo:', error);
    }
}

function almacenarUsuario(usuario) {
    try {
        // Initialize the user's cart
        usuario.carrito = [];

        // Get the current list of users from localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Add the new user to the list
        usuarios.push(usuario);

        // Save the updated list back to localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    } catch (error) {
        console.error('Error almacenando usuario:', error);
    }
}

async function iniciarSesion(username, password) {
    try {
        let usuarios = await obtenerUsuariosDefault();
        let usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
        let allusers = [...usuarios, ...usuariosLocales];
        let usuario =  allusers.find(usuario => usuario.username === username && usuario.password === password);
        if(usuario) {
            let carritoGuardado = JSON.parse(localStorage.getItem(usuario.username)) || [];
            usuario.carrito = carritoGuardado;
            localStorage.setItem('usuarioLogeado', JSON.stringify(usuario));
            }

        return usuario ||null;
    } catch (error) {
        console.error('Error iniciando sesión:', error);
    }
}
//eventos
document.addEventListener("DOMContentLoaded", function() {
    let Registro = document.getElementById("Register");
    let login = document.getElementById("login");
    let titulo = document.getElementById("titulo");

    document.getElementById("openReg").addEventListener("click", (evento) => {
        evento.preventDefault();
        Registro.style.display = "flex";
        titulo.textContent = "Registro";
        login.style.display = "none";
    });

    document.getElementById("goBack").addEventListener("click", (evento) => {
        evento.preventDefault();
        Registro.style.display = "none";
        titulo.textContent = "Login";
        login.style.display = "flex";
    });

    document.getElementById("login").addEventListener("submit", async (evento) => {
        try {
            evento.preventDefault();
            let username = document.getElementById("username");
            let password = document.getElementById("password");
            if(validarCampo(username) && validarCampo(password)) {
                let usuario  = await iniciarSesion(username.value, password.value);
                if(usuario) {
                    localStorage.setItem('usuarioLogeado', JSON.stringify(usuario));
                    actualizarHeader();
                    window.location.href = "../index.html";
                } else {
                    alert("Usuario o contraseña incorrectos");

                }
            }
        } catch (error) {
            console.error('Error en el evento de submit del login:', error);
        }
    });

    document.getElementById("Register").addEventListener("submit", (evento) => {
        try {
            evento.preventDefault();
            let regUsername = document.getElementById("regUsername");
            let regPassword = document.getElementById("regPassword");
            let nombre = document.getElementById("nombre");
            let apellidos = document.getElementById("apellidos");
            let telefono = document.getElementById("telefono");
            let DNI = document.getElementById("DNI");
            let edad = document.getElementById("edad");
            let email = document.getElementById("email"); // nuevo campo de correo electrónico
            if (validarCampo(regUsername) && validarCampo(regPassword) && validarCampo(nombre) && validarCampo(apellidos) && validarCampo(telefono) && validarCampo(DNI) && validarCampo(edad) && validarCampo(email)) { // validación del nuevo campo de correo electrónico
                let usuario = {
                    username: regUsername.value,
                    password: regPassword.value,
                    nombre: nombre.value,
                    apellidos: apellidos.value,
                    telefono: telefono.value,
                    DNI: DNI.value,
                    edad: edad.value,
                    email: email.value
                };
                almacenarUsuario(usuario);
                window.location.href = "../html/login.html";
                alert("Usuario registrado correctamente");

            }
        } catch (error) {
            console.error('Error en el evento de submit del registro:', error);
        }
    });

    actualizarHeader();
});
