'use strict';

//Imports de las funciones de Firebase necesarias.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    signInWithRedirect,
    getRedirectResult,
    fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

//Configuración del proyecto.
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

//Inicializamos la aplicación de Firebase utilizando nuestra configuración del proyecto.
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
//Para acceder a Realtime Database.
const database = getDatabase(app);
//Para acceder a Storage.
const storage = getStorage(app);
//Referencia a los animales dentro de la base de datos.
const animalesRef = databaseRef(database, 'animales');

//Función para comprobar si un correo ya está en uso.
export function checkIfEmailExists(email) {
    return fetchSignInMethodsForEmail(auth, email)
        .then((signInMethods) => {
            //Si la lista de métodos de inicio de sesión no está vacía, el correo ya está registrado.
            if (signInMethods.length > 0) {
                return true;
            } else {
                return false;
            }
        })
        .catch((error) => {
            throw error;
        });
}

//Función para el registro de un usuario.
export async function register(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        //Se redirige al usuario a 'index.html'.
        window.location.href = 'index.html';
    } catch (error) {
        //Si el correo ingresado está en uso, se lanza el error.
        throw error;
    }
}

//Función para el inicio de sesión con correo y contraseña.
export function loginEmail(email, password) {
    //Llamada al método de Firebase para iniciar sesión con email y contraseña.
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //Redirigimos al usuario a 'index.html'.
            window.location.href = 'index.html';
            const user = userCredential.user;
        })
        .catch((error) => {
            //Se avisa al usuario de que los datos introducidos no son válidos.
            const div = document.querySelector("#msj-error");
            div.innerHTML = '(Los datos introducidos no son válidos)';
        });
}

//Función para conocer si el usuario esta logueado o no y en función de esto mostrar las diferentes interfaces.
function stateUser() {
    //Siempre que haya un cambio en la autenticación, es decir, se loguee el usuario o se desloguee:
    onAuthStateChanged(auth, (user) => {
        //Si el usuario está logueado:
        if (user) {
            //Cambiamos el header para que se muestre el botón de 'Mi cuenta'.
            const botones = document.querySelector(".botones");
            const profile = document.querySelector(".profile");
            const div = document.querySelector("#fondo-login");
            const html_index = document.querySelector(".html_index");
            const body_index = document.querySelector(".body_index");
            html_index.style.overflowY = "visible";
            body_index.style.overflowY = "visible";
            if (profile && botones && div) {
                profile.style.display = "flex";
                div.style.display = "none";
            }
            //Obtenemos los datos del usuario.
            const uid = user.uid;
            const displayName = user.displayName;
            const email = user.email;
            const photoURL = user.photoURL;
            //Obtenemos los elementos del DOM.
            const foto = document.querySelector("#foto");
            const correo = document.querySelector("#correo");
            const nombre = document.querySelector("#nombre");
            const animales = document.querySelector("#animalInfo");

            //Si estamos en 'animales.html' mostramos los animales.
            if (animales) {
                animales.style.display = "flex";
            }
            //Si estamos en 'Mi cuenta', es decir en 'profile.html', mostramos la información del usuario.
            if (foto && correo && nombre) {
                if (displayName != null) {
                    nombre.innerHTML = '<h2>Nombre</h2> <h3>' + displayName + '</h3';
                }
                if (photoURL != null) {
                    foto.innerHTML = '<h2>Foto de perfil</h2> <img src="' + photoURL + '" >';
                } else {
                    foto.innerHTML = '<h2>Foto de perfil</h2> <div><img src="../img/foto_perfil.png" ></div>';
                }
                correo.innerHTML = '<h2>Correo</h2> <h3>' + email + '</h3';
            }
            return true;
        } else {
            //Si el usuario no está logueado, mostramos en el header los botones de inicio de sesión y de registro.
            const botones = document.querySelector(".botones");
            const profile = document.querySelector(".profile");
            if (profile && botones) {
                botones.style.display = "flex";
                profile.style.display = "none";
            }
            //Si el usuario se encuentra en 'animales.html', mostramos un mensaje de que debe registrarse si desea verlos.
            const msjNoLogin = document.querySelector("#msj_nologin");
            if (msjNoLogin) {
                msjNoLogin.style.display = "flex";
            }
            return false;
        }
    });
}

//Función para el inicio de sesión Google.
export async function loginGoogle() {
    try {
        //Si la pantalla es más grande de 750px, saldrá un popup de lo contrario será una redirección.
        if (window.innerWidth > 750) {
            //Llamada al método de Firebase para iniciar sesión con popup de Google.
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            window.location.href = 'index.html';
        } else {
            //Llamada al método de Firebase para iniciar sesión con redirección de Google.
            signInWithRedirect(auth, googleProvider);
            const userCred = await getRedirectResult(auth);
            const credential = GoogleAuthProvider.credentialFromResult(userCred);
        }
    } catch (error) {
    }
}

//Función para el inicio de sesión Google.
export async function loginGithub() {
    try {
        //Si la pantalla es más grande de 750px, saldrá un popup de lo contrario será una redirección.
        if (window.innerWidth > 750) {
            //Llamada al método de Firebase para iniciar sesión con popup de GitHub.
            const result = await signInWithPopup(auth, githubProvider);
            const credential = GithubAuthProvider.credentialFromResult(result);
            window.location.href = 'index.html';
        } else {
            //Llamada al método de Firebase para iniciar sesión con redirección de GitHub.
            signInWithRedirect(auth, githubProvider);
            const result = await getRedirectResult(auth);
            const credential = GithubAuthProvider.credentialFromResult(result);
        }
    } catch (error) {
        const div = document.querySelector("#msj-error");
        div.innerHTML = '(La cuenta está asociada a otro inicio de sesión)';
    }
}

//Función para cerrar sesión.
export async function logOut() {
    try {
        //Llamada al método de Firebase para cerrar sesión.
        await signOut(auth);
    } catch (error) {
        console.error('Error al cerrar sesión:', error.code, error.message);
    }
}

//Referencia a Firebase Storage para la carpeta 'pets'.
const petStorageRef = storageRef(storage, 'pets');


//Función para cargar y mostrar la información de los animales.
function mostrarInformacionAnimales(categoria_selecionada) {
    //Obtenemos el elemento en el que incluiremos la información de los animales.
    const animalInfoDiv = document.getElementById("animalInfo");
    if (animalInfoDiv && categoria_selecionada) {
        //Referencia a la ubicación de los datos de los animales en la base de datos.
        onValue(animalesRef, (snapshot) => {
            animalInfoDiv.innerHTML = `<h1><u>Nuestros animales</u></h1>`;
            let animales = `<div class="contenedor">`;
            //Mostramos la información de cada animal.
            snapshot.forEach((childSnapshot) => {
                const animalData = childSnapshot.val();
                //Se muestran los animales que se deban mostrar en función del valor almacenado en sessionStorage.
                if (animalData.tipo === categoria_selecionada || categoria_selecionada === 'Todos') {
                    animales += `<div class="animal"><div class="nombre">
                                    <h2>${animalData.nombre}</h2></div><div class="datos">`;
                    for (let prop in animalData) {
                        if (prop !== 'imagen' && prop !== 'tipo' && prop !== 'id' && prop !== 'adoptado' && prop !== 'nombre') {
                            if (prop === 'telefono') {
                                animales += `<div><b>Teléfono de contacto:</b> +34 ${animalData[prop]}</div></div>`;
                            } else if (prop === 'raza') {
                                animales += `<div><b>Raza:</b> ${animalData[prop]}</div>`;
                            } else if (prop === 'descripcion') {
                                animales += `<div class="descripcion">${animalData[prop]}</div>`;
                            } else {
                                animales += `<div><b>Fecha de nacimiento:</b> ${animalData[prop]}</div>`;
                            }
                        }
                    }
                    //Mostramos la imagen almacenada en Firebase Storage. Comprobamos si el animal tiene la propiedad 'imagen'.
                    if (animalData.imagen) {
                        //Si existe creamos un identificador único.
                        const imagenId = "img-" + childSnapshot.key;
                        //Agregamos la imagen cuyo 'src' vacío actualizaremos después.
                        animales += `<div class="div_img"><img id="${imagenId}" src="" alt="${animalData.nombre}"></div>`;
                        //Creamos una referencia a la ubicación de la imagen almacenada en Firebase Storage usando la ruta de la imagen almacenada en la base de datos.
                        const imagenRef = storageRef(storage, `pets/${animalData.imagen}`);
                        //Obtenemos la URL de descarga de la imagen de Firebase Storage.
                        getDownloadURL(imagenRef)
                            .then((url) => {
                                //Si se ha obtenido la URL de manera exitosa, se actualiza el src de la imagen.
                                document.getElementById(imagenId).src = url;
                            })
                            .catch((error) => {
                                console.error("Error al obtener la URL de descarga de la imagen:", error);
                            });
                    }

                    animales += `</div>`;
                }
            });
            animales += `</div>`;
            animalInfoDiv.innerHTML += animales;
        });
    }
}

//Función que hace la llamada a 'mostrarInformacionAnimales()'.
function iniciarDespuesDeCarga() {
    const categoriaSeleccionada = sessionStorage.getItem('categoriaSeleccionada');
    if (categoriaSeleccionada) {
        mostrarInformacionAnimales(categoriaSeleccionada);
    }
}

//Después de que cargué el contenido, se llama a la función.
document.addEventListener('DOMContentLoaded', stateUser());

//Después de que cargué el contenido, se llama a la función.
document.addEventListener('DOMContentLoaded', iniciarDespuesDeCarga);

//Si el contenido ya se ha cargado antes de que se añada el event listener, se llama directamente a la función.
if (document.readyState === 'complete') {
    iniciarDespuesDeCarga();
}