'use strict';

//Cuando el DOM está cargado, comprobamos si existe la flecha en él y de ser así se espera el evento de click para desplegar las categorías del subheader.
document.addEventListener('DOMContentLoaded', function () {
    var flecha = document.getElementById('flecha');
    var body = document.body;
    if (flecha) {
        flecha.addEventListener('click', function () {
            body.classList.toggle('subheader-visible');
        });
    }
});

//Cuando el DOM esté cargado:
document.addEventListener('DOMContentLoaded', () => {
    //Seleccionamos todos los elementos con la clase 'categoria'.
    const categorias = document.querySelectorAll('.categoria');
    //Agregamos un manejador de eventos de click a cada elemento.
    categorias.forEach(categoria => {
        categoria.addEventListener('click', () => {
            //Guardamos la segunda clase, que no es 'categoria', en sessionStorage.
            const segundaClase = categoria.classList[1];
            sessionStorage.setItem('categoriaSeleccionada', segundaClase);
            //Redirigimos al usuario a la página 'animales.html'.
            window.location.href = 'animales.html';
        });
    });
});