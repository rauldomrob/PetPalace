'use strict';

//Import de las funciones de 'firebase.js'.
import { register, checkIfEmailExists } from "./firebase.js";

//Se llama a la función 'showPassword()' cuando el DOM termina de cargarse.
document.addEventListener('DOMContentLoaded', function () {
    showPassword();
});

//Función para mostrar las contraseñas ingresadas.
function showPassword() {
    //Seleccionamos todos los elementos con la clase 'ojo'.
    const eyes = document.querySelectorAll(".ojo");
    //Agregamos un manejador de eventos de click a cada elemento.
    eyes.forEach(function (eye) {
        const passInput = eye.previousElementSibling;
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
    });
}

//Cuando se pulsa el botón para registrarse:
const ButtonRegister = document.querySelector("#btn-register");
ButtonRegister.addEventListener("click", () => {
    //Obtenemos los valores de los inputs.
    let email = document.querySelector("#register-email").value;
    let password = document.querySelector("#register-password-1").value;
    let password2 = document.querySelector("#register-password-2").value;
    let date = document.querySelector("#register-fecha").value;
    let todoemail = document.querySelector("#register-email");
    let error = document.querySelector("#texto-oculto");

    //Cambiamos la visibilidad del mensaje de error.
    error.style.visibility = "hidden";
    error.textContent = "";
    error.innerHTML = "";
    error.style.marginBottom = "5px";

    //Comprobación si el email tiene formato de email.
    if (validateEmail(email)) {
        //Comprobación si las contraseñas cumplen con los requisitos de contraseña segura y son iguales.
        if (validatePassword(password, password2)) {
            //Comprobación de si el usuario es mayor de edad.
            if (validateDate(date)) {
                //Comprobación de si el email ya está en uso.
                checkIfEmailExists(email).then((exists) => {
                    if (exists) {
                        let error = document.querySelector("#texto-oculto");
                        error.style.visibility = "visible";
                        error.textContent = "El email ingresado ya está en uso.";
                        todoemail.value = "";
                    } else {
                        //Si el email no está en uso, se llama a la función 'registerNewUser()'.
                        registerNewUser(email, password);
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }
});

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

//Función que valida las contraseñas ingresadas.
function validatePassword(password, password2) {
    //Si las contraseñas son iguales y seguras, la contraseña es válida.
    if (password === password2 && /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
        return true;
    } else {
        //Si las contraseñas no son iguales o no son seguras, se avisa al usuario de ello.
        if (password !== password2) {
            let error = document.querySelector("#texto-oculto");
            error.style.visibility = "visible";
            error.textContent = "Las contraseñas no coinciden.";
        } else {
            let error = document.querySelector("#texto-oculto");
            error.style.visibility = "visible";
            error.style.marginBottom = "40px";
            error.innerHTML = "La contraseña debe contener al menos <br> 8 caracteres e incluir una mayúscula <br> y un número.";
        }
        return false;
    }
}

//Función que valida si el usuario tiene al menos 18 años.
function validateDate(date) {
    var fechaActual = new Date();
    var anoActual = fechaActual.getFullYear();
    var ano = parseInt(date.split("-")[0], 10);
    if (/^(\d{4})-(\d{2})-(\d{2})$/.test(date) && (ano >= 1900 && ano <= (anoActual - 18))) {
        return true;
    } else {
        //Si el usuario no tiene más de 18 años se le avisa que debe tenerlos.
        let error = document.querySelector("#texto-oculto");
        error.style.visibility = "visible";
        error.textContent = "Debes tener más de 18 años.";
    }
}

//Función asíncrona para el registro del nuevo usuario.
async function registerNewUser(email, password) {
    try {
        //Llamada a la función 'register()' importada de 'firebase.js'.
        await register(email, password);
    } catch (error) {
        //Se avisa al usuario de que el email ingresado ya está en uso.
        let error_mnj = document.querySelector("#texto-oculto");
        error_mnj.style.visibility = "visible";
        error_mnj.textContent = "El email ingresado ya está en uso.";
        let todoemail = document.querySelector("#register-email");
        todoemail.value = "";
    }
}
