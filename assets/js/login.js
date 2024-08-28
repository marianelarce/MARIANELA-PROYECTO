//Ejecutando funciones
document
  .getElementById("btn__iniciar-sesion")
  .addEventListener("click", iniciarSesion);
document.getElementById("btn__registrarse").addEventListener("click", register);
window.addEventListener("resize", anchoPage);

//Declarando variables
const formulario_login = document.querySelector(".formulario__login");
const formulario_register = document.querySelector(".formulario__register");
const contenedor_login_register = document.querySelector(
  ".contenedor__login-register"
);
const caja_trasera_login = document.querySelector(".caja__trasera-login");
const caja_trasera_register = document.querySelector(".caja__trasera-register");

//FUNCIONES
function anchoPage() {
  if (window.innerWidth > 850) {
    caja_trasera_register.style.display = "block";
    caja_trasera_login.style.display = "block";
  } else {
    caja_trasera_register.style.display = "block";
    caja_trasera_register.style.opacity = "1";
    caja_trasera_login.style.display = "none";
    formulario_login.style.display = "block";
    contenedor_login_register.style.left = "0px";
    formulario_register.style.display = "none";
  }
}

anchoPage();

function iniciarSesion() {
  if (window.innerWidth > 850) {
    formulario_login.style.display = "block";
    contenedor_login_register.style.left = "10px";
    formulario_register.style.display = "none";
    caja_trasera_register.style.opacity = "1";
    caja_trasera_login.style.opacity = "0";
  } else {
    formulario_login.style.display = "block";
    contenedor_login_register.style.left = "0px";
    formulario_register.style.display = "none";
    caja_trasera_register.style.display = "block";
    caja_trasera_login.style.display = "none";
  }
}

function register() {
  if (window.innerWidth > 850) {
    formulario_register.style.display = "block";
    contenedor_login_register.style.left = "410px";
    formulario_login.style.display = "none";
    caja_trasera_register.style.opacity = "0";
    caja_trasera_login.style.opacity = "1";
  } else {
    formulario_register.style.display = "block";
    contenedor_login_register.style.left = "0px";
    formulario_login.style.display = "none";
    caja_trasera_register.style.display = "none";
    caja_trasera_login.style.display = "block";
    caja_trasera_login.style.opacity = "1";
  }
}

const formLogin = document.querySelector("#form_login");
const formRegister = document.querySelector("#form_register");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData(formLogin);
    const res = await fetch("./api/login/log-in", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.status === 200) {
      window.location.href = "./mascotas.html";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    alert("Ocurrió un error");
  }

});

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData(formRegister);
    const res = await fetch("./api/login/registro", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.status === 200) {
      alert("Usuario registrado exitosamente");
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Ocurrió un error");
  }
});

