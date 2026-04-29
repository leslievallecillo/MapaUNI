document.addEventListener("DOMContentLoaded", function () {
  fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
      const contenedor = document.getElementById("menu-contenedor");
      if (contenedor) {
        contenedor.innerHTML = data;
        const navItem = document.getElementById("nav-contactos");
        if (navItem) navItem.classList.add("activo");
      }
    })
    .catch(error => console.log("Navbar no encontrado:", error));

  fetch("Json/contactos.json") 
    .then(response => response.json())
    .then(datos => {
      document.getElementById("titulo-contacto").textContent = datos.titulo;
      document.getElementById("subtitulo-contacto").textContent = datos.subtitulo;
      document.getElementById("label-nombre").textContent = datos.formulario.nombre.label;
      document.getElementById("nombre").placeholder = datos.formulario.nombre.placeholder;
      document.getElementById("label-correo").textContent = datos.formulario.correo.label;
      document.getElementById("correo").placeholder = datos.formulario.correo.placeholder;
      document.getElementById("label-mensaje").textContent = datos.formulario.mensaje.label;
      document.getElementById("mensaje").placeholder = datos.formulario.mensaje.placeholder;
      document.getElementById("boton-enviar").innerHTML = `<span class="material-icons">send</span> ${datos.formulario.boton}`;
      document.getElementById("info-correo-titulo").textContent = datos.informacion.correo.titulo;
      document.getElementById("info-correo-email").textContent = datos.informacion.correo.email;
      document.getElementById("info-correo-email").href = `mailto:${datos.informacion.correo.email}`;
      document.getElementById("info-correo-detalle").textContent = datos.informacion.correo.detalle;
      document.getElementById("info-ubicacion-titulo").textContent = datos.informacion.ubicacion.titulo;
      document.getElementById("info-ubicacion-detalle").textContent = datos.informacion.ubicacion.detalle;
      document.getElementById("info-colaboracion-titulo").textContent = datos.informacion.colaboracion.titulo;
      document.getElementById("info-colaboracion-detalle").textContent = datos.informacion.colaboracion.detalle;
      document.getElementById("footer-marca").textContent = datos.footer.marca;
      document.getElementById("footer-descripcion").textContent = datos.footer.descripcion;
      document.getElementById("footer-correo").textContent = datos.informacion.correo.email;
      document.getElementById("footer-ubicacion").textContent = datos.informacion.ubicacion.detalle;
      document.getElementById("footer-copyright").textContent = datos.footer.copyright;
    })
    .catch(error => console.error("Error cargando el JSON de contactos:", error));
});


const formulario = document.querySelector(".contact-form");

if (formulario) {
  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const boton = formulario.querySelector('button[type="submit"]');
    const data = new FormData(event.target);
    const textoOriginal = boton.innerHTML;
    
    boton.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...`;
    boton.disabled = true;
    boton.style.opacity = "0.7";

    fetch(event.target.action, {
      method: formulario.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Mensaje Enviado!',
          text: 'Gracias por escribirnos, el equipo de UNI-WAY te responderá pronto.',
          confirmButtonColor: '#00d2ff',
          timer: 5000
        });
        formulario.reset();
      } else {
        throw new Error();
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: 'No pudimos enviar el mensaje. Inténtalo de nuevo más tarde.',
        confirmButtonColor: '#ff4b2b'
      });
    })
    .finally(() => {
      boton.innerHTML = textoOriginal;
      boton.disabled = false;
      boton.style.opacity = "1";
    });
  });
}