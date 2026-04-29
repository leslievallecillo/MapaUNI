let datosFavoritos = [];

fetch('Json/guia.json')
    .then(res => res.json())
    .then(data => datosFavoritos = data);

fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('menu-contenedor').innerHTML = data;
    const navItem = document.getElementById('nav-guia');
    if (navItem) navItem.classList.add('activo');
  });

function abrirSimulacion(lugar) {
    const modal = document.getElementById('videoModal');
    const title = document.getElementById('modalTitle');
    title.innerText = 'Ruta hacia: ' + lugar;
    modal.classList.add('active');
}

function cerrarSimulacion() {
    document.getElementById('videoModal').classList.remove('active');
}

function abrirModalSmart(tipo) {
    const titulo = document.getElementById('smartTitle');
    const cuerpo = document.getElementById('smartBody');
    const lugar = datosFavoritos.find(item => item.id === tipo);

    if (lugar) {
        titulo.innerText = lugar.titulo;
        cuerpo.innerHTML = `
            <div class="contenedor-media-modal">
                <img src="${lugar.imagen}" class="imagen-lugar" alt="${lugar.titulo}">
                <iframe src="${lugar.mapa_url}" class="mapa-iframe" allowfullscreen loading="lazy"></iframe>
            </div>
            
            <div class="info-texto-modal">
                <h4>Descripción</h4>
                <p>${lugar.descripcion}</p>
            </div>
            
            <div class="info-texto-modal">
                <h4 style="color: ${lugar.color};">¿Por qué lo recomendamos?</h4>
                <p>${lugar.recomendacion}</p>
            </div>

            <form id="form-comentarios" class="formulario-guia">
                <h4>Enviar Comentario</h4>
                <label>Tu nombre:</label>
                <input type="text" name="nombre" placeholder="Ej. Juan Pérez" required>
                
                <label>Calificación:</label>
                <select name="calificacion" required>
                    <option value="" disabled selected>Seleccionar...</option>
                    <option value="5">Excelente</option>
                    <option value="4">Muy Bueno</option>
                    <option value="3">Bueno</option>
                    <option value="2">Regular</option>
                    <option value="1">Malo</option>
                </select>

                <label>Tu opinión:</label>
                <textarea name="mensaje" placeholder="Cuéntanos tu experiencia..." required></textarea>
                
                <input type="hidden" name="lugar" value="${lugar.titulo}">

                <button type="submit" class="btn-enviar-resena">Enviar a Formspree</button>
            </form>
            
            <button class="btn-select" style="margin-top: 15px; width: 100%;" onclick="window.location.href='destinos.html'">Ver Ruta en Mapa GPS</button>
        `;

        const form = document.getElementById('form-comentarios');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.innerText = "Enviando...";
            btn.disabled = true;

            const formspreeUrl = "https://formspree.io/f/mdayqwgp"; 

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            fetch(formspreeUrl, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                
                    Swal.fire({
                        title: '¡Mensaje enviado!',
                        text: 'Tu comentario ha sido enviado correctamente.',
                        icon: 'success',
                        timer: 2500,
                        showConfirmButton: false
                    }).then(() => {
                        cerrarModalSmart();
                    });
                } else {
                   
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al enviar. Asegúrate de tener conexión a internet.',
                        icon: 'error',
                        confirmButtonColor: '#0056b3'
                    });
                    btn.innerText = "Enviar a Formspree";
                    btn.disabled = false;
                }
            }).catch(error => {
                
                Swal.fire({
                    title: 'Error de conexión',
                    text: 'Ocurrió un error de red. Inténtalo más tarde.',
                    icon: 'error',
                    confirmButtonColor: '#0056b3'
                });
                btn.innerText = "Enviar a Formspree";
                btn.disabled = false;
            });
        });
    }
    
    document.getElementById('modalSmart').classList.add('active');
}

function cerrarModalSmart() {
    document.getElementById('modalSmart').classList.remove('active');
}