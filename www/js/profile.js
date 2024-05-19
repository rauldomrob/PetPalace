'use strict';

//Import de la función logOut() de 'firebase.js'.
import { logOut } from "./firebase.js";

//Cuando se hace el click en el botón de cerrar sesión se llama a la función 'log_out()'.
const boton = document.querySelector("#logout");
boton.addEventListener('click', function () {
    log_out();
});

//Esta función permite el cierre de sesión mediante la función 'logOut()' importada de 'firebase.js'.
function log_out() {
    logOut();
    //Redirigimos al usuario a 'index.html'.
    window.location.href = 'index.html';
}