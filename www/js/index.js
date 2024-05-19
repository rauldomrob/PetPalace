'use strict';

//Animación del botón de 'Ver animales'. 
//Si se pulsa dicho botón establecemos la variable de 'sessionStorage' con el valor de 'Todos' y redirigimos al usuario a 'animales.html'.
document.addEventListener('DOMContentLoaded', () => {
    const botonVerAnimales = document.getElementById('boton_ver_animales');
    if (botonVerAnimales) {
        botonVerAnimales.addEventListener('click', () => {
            sessionStorage.setItem('categoriaSeleccionada', 'Todos');
            window.location.href = 'animales.html';
        });

        botonVerAnimales.addEventListener('click', () => {
            sessionStorage.setItem('categoriaSeleccionada', 'Todos');
            window.location.href = 'animales.html';
        });
    }
});