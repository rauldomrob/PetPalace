'use strict';

//Import de las funciones de 'firebase.js'.
import { loginGoogle, loginGithub, loginEmail } from "./firebase.js";

//Se llama a las funciones una vez que el DOM termina de cargarse.
document.addEventListener('DOMContentLoaded', () => {
    showPass();
    logGithub();
    logEmail();
    closeLogin();
    logGoogle();
    openLogin();
});

//Función para el inicio de sesión del usuario con correo y contraseña.
function logEmail() {
    var btnLogin = document.querySelector("#btn-login");
    if (btnLogin) {
        //Si se pulsa el botón para acceder a la cuenta: 
        btnLogin.addEventListener("click", () => {
            //Obtenemos los valores de los inputs.
            let email = document.querySelector("#login-email").value;
            let password = document.querySelector("#login-password").value;
            try {
                //Comprobamos si el email es válido.
                if (validateEmail(email)) {
                    //Se llama a la función 'loginEmail()' importada de 'firebase.js'.
                    loginEmail(email, password);
                }
            } catch (error) {
                const div = document.querySelector("#msj-error");
                div.innerHTML = '(Los datos introducios no son válidos)';
            }
        });
    }
}

//Función para mostrar las contraseñas ingresadas.
function showPass() {
    //Seleccionamos todos los elementos con la clase 'ojo'.
    const eyes = document.querySelectorAll(".ojo");
    //Agregamos un manejador de eventos de click a cada elemento.
    eyes.forEach(function (eye) {
        const passInput = eye.previousElementSibling;
        if (eye) {
            eye.addEventListener("click", function () {
                //Si se pulsa el elemento cambiamos la foto.
                if (passInput.type === "password") {
                    //Si el elemento hermano es un input de tipo 'password', pasará a ser de tipo 'text'.
                    eye.src = "./img/ojo_abierto.png";
                    eye.border = "1px solid black";
                    passInput.type = "text";
                } else {
                    //Si el elemento hermano es un input de tipo 'text', pasará a ser de tipo 'password'.
                    eye.src = "./img/ojo_cerrado.png";
                    eye.border = "none";
                    passInput.type = "password";
                }
            });
        }
    });
}

//Función para abrir el popup de iniciar sesión.
function openLogin() {
    document.body.addEventListener("click", (e) => {
        //Comprobamos si el elemento que generó el evento coincide con el elemento que contiene el id.
        if (e.target.matches("#open-login")) {
            //Obtenemos los elementos del DOM.
            const div = document.querySelector("#fondo-login");
            const html_index = document.querySelector(".html_index");
            const body_index = document.querySelector(".body_index");
            const portada = document.querySelector(".img_portada");
            if (div) {
                //Cambiamos la visibilidad del popup para que se vea.
                div.style.display = "flex";
                div.style.position = "fixed";
                if (portada) {
                    portada.style.transform = "translateX(-9px)";
                }
                //Deshabilitamos el overflow, es decir que no se pueda hacer scroll.
                html_index.style.overflowY = "hidden";
                body_index.style.overflowY = "hidden";
            }
        }
    });
}

//Función para cerrar el popup de iniciar sesión.
function closeLogin() {
    //Obtenemos los elementos del DOM.
    const btnClose = document.querySelector("#cerrar-login");
    const div = document.querySelector("#fondo-login");
    const html_index = document.querySelector(".html_index");
    const body_index = document.querySelector(".body_index");
    const portada = document.querySelector(".img_portada");
    const msjNoLogin = document.querySelector("#msj_nologin");
    const msjError = document.querySelector("#msj-error");
    if (btnClose) {
        //Si se pulsa el botón de cerrar, se cambia la visibilidad del popup para que se oculte.
        btnClose.addEventListener("click", (e) => {
            if (div) {
                if (portada) {
                    portada.style.transform = "translateX(0px)";
                }
                if (msjNoLogin) {
                    msjError.innerHTML = '';
                    msjNoLogin.style.display = "none";
                }
                div.style.display = "none";
                //Habilitamos el overflow, es decir que se pueda hacer scroll nuevamente.
                html_index.style.overflowY = "visible";
                body_index.style.overflowY = "visible";
            }
        });
    }
}

//Función para iniciar sesión con Google.
function logGoogle() {
    const btnGoogle = document.querySelector("#google");
    if (btnGoogle) {
        //Si se pulsa el botón, se llama a la función 'loginGoogle()' importada de 'firebase.js'.
        btnGoogle.addEventListener("click", (e) => {
            try {
                loginGoogle();
            } catch (error) {
                throw new Error(error);
            }
        });
    }
}

//Función para iniciar sesión con GitHub.
function logGithub() {
    const btnGithub = document.querySelector("#github");
    if (btnGithub) {
        //Si se pulsa el botón, se llama a la función 'loginGithub()' importada de 'firebase.js'.
        btnGithub.addEventListener("click", (e) => {
            try {
                loginGithub();
            } catch (error) {
                throw new Error(error);
            }
        });
    }
}

//Función que valida el email ingresado. Se comprueba que tenga formato de email y se avisa al usuario en caso contrario.
function validateEmail(email) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return true;
    } else {
        let error = document.querySelector("#texto-oculto");
        error.style.visibility = "visible";
        error.textContent = "El email ingresado no es válido.";
        return false;
    }
}