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
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios.push(usuario);
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
        return allusers.some(usuario => usuario.username === username && usuario.password === password);
    } catch (error) {
        console.error('Error iniciando sesión:', error);
    }
}
//variables

let Registro = document.getElementById("Register");
let login = document.getElementById("login");
let titulo = document.getElementById("titulo");



//eventos

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
            if (await iniciarSesion(username.value, password.value)) {
                alert("Bienvenido");
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
        if (validarCampo(regUsername) && validarCampo(regPassword) && validarCampo(nombre) && validarCampo(apellidos) && validarCampo(telefono) && validarCampo(DNI) && validarCampo(edad)) {
            let usuario = {
                username: regUsername.value,
                password: regPassword.value,
                nombre: nombre.value,
                apellidos: apellidos.value,
                telefono: telefono.value,
                DNI: DNI.value,
                edad: edad.value
            };
            almacenarUsuario(usuario);
            alert("Usuario registrado correctamente");
        }
    } catch (error) {
        console.error('Error en el evento de submit del registro:', error);
    }
});

