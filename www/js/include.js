'use strict';

//Script que permite incluir páginas de html en otras.
//Cuando se cargue el DOM.
document.addEventListener('DOMContentLoaded', e => {
    //Método para incluir html, el: elemento, url: url de la página.
    const includeHTML = (el, url) => {
        //Objeto para realizar solicitudes asíncronas (AJAX).
        const xhr = new XMLHttpRequest();
        //Escuchar cambios en el estado de la solicitud. Cuando el estado cambia, se ejecutará la función proporcionada.
        xhr.addEventListener("readystatechange", e => {
            //Se verifica que el estado de la solicitud sea 4 (indicando que la solicitud ha sido completada).
            if (xhr.readyState !== 4) return;
            //Se verifica que el código de estado de la respuesta esté en el rango de 200 a 299, lo que indica una respuesta exitosa del servidor.
            if (xhr.status >= 200 && xhr.status < 300) {
                //Se incluye el código html.
                el.innerHTML = xhr.responseText;
                //Evento personalizado para cargar los scrips.
                const event = new Event("contentLoaded");
                document.dispatchEvent(event);
            } else {
                //Si no está en rango devuelve un error.
                let message = xhr.statusText || "Error loading the file, verify that you are making the request by http or https";
                el.innerHTML = `<div><p>Error ${xhr.status}: ${message}</p></div>`;
            }
        });
        //Se establece la configuración de la solicitud.
        xhr.open('GET', url);
        //Incluye en el header.
        xhr.setRequestHeader("Content-type", "text/html; charset=utf-8");
        //Se envía la solicitud HTTP al servidor.
        xhr.send();
    }
    //Carga la función includeHTML() a todos los elementos con el atributo  data-include="url".
    document
        .querySelectorAll("[data-include]")
        .forEach(el => includeHTML(el, el.getAttribute("data-include")));
});