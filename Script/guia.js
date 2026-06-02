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

function abrirModalSmart(tipo) {
    const titulo = document.getElementById('smartTitle');
    const cuerpo = document.getElementById('smartBody');
    const lugar = datosFavoritos.find(item => item.id === tipo);

    if (lugar) {
        titulo.innerText = lugar.titulo;

        const resenasGuardadas = JSON.parse(localStorage.getItem('resenas_uniway')) || [];
        const resenasLugar = resenasGuardadas.filter(r => r.lugarId === tipo);

        let htmlResenas = '';
        if (resenasLugar.length > 0) {
            htmlResenas = resenasLugar.map(r => `
                <div style="background: #f1f3f5; padding: 10px; border-radius: 6px; margin-bottom: 10px; text-align: left;">
                    <strong style="color: var(--primary-color); font-size: 14px;">${r.nombre}</strong> 
                    <span style="color: #f39c12; font-size: 13px;">(Nota: ${r.calificacion}/5)</span>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #555;">${r.mensaje}</p>
                </div>
            `).join('');
        } else {
            htmlResenas = '<p style="font-size: 13px; color: #777; text-align: center;">Aún no hay opiniones. ¡Sé el primero!</p>';
        }

        cuerpo.innerHTML = `
            <div class="contenedor-media-modal">
                <img src="${lugar.imagen}" class="imagen-lugar" alt="${lugar.titulo}">
            </div>
            
            <div class="info-texto-modal">
                <h4>Descripción</h4>
                <p>${lugar.descripcion}</p>
            </div>
            
            <div class="info-texto-modal">
                <h4 style="color: ${lugar.color};">¿Por qué lo recomendamos?</h4>
                <p>${lugar.recomendacion}</p>
            </div>

            <div style="margin-top: 20px;">
                <h4 style="color: #333; font-size: 15px; margin-bottom: 10px; border-bottom: 2px solid #ddd; padding-bottom: 5px; text-align: left;">Opiniones de Estudiantes</h4>
                <div id="contenedor-lista-resenas" style="max-height: 150px; overflow-y: auto; margin-bottom: 15px;">
                    ${htmlResenas}
                </div>
            </div>

            <form id="form-comentarios" class="formulario-guia">
                <h4 style="text-align: center; margin-bottom: 15px;">Añadir Reseña</h4>
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

                <button type="submit" class="btn-enviar-resena">Guardar Opinión</button>
            </form>
            
            <button class="btn-select" style="margin-top: 15px; width: 100%;" onclick="window.location.href='destinos.html'">Ver Ruta en Mapa GPS</button>
        `;

        const form = document.getElementById('form-comentarios');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const nuevaResena = {
                lugarId: tipo,
                nombre: formData.get('nombre'),
                calificacion: formData.get('calificacion'),
                mensaje: formData.get('mensaje')
            };

            const todasLasResenas = JSON.parse(localStorage.getItem('resenas_uniway')) || [];
            todasLasResenas.push(nuevaResena);
            localStorage.setItem('resenas_uniway', JSON.stringify(todasLasResenas));

            Swal.fire({
                title: '¡Guardado!',
                text: 'Tu comentario ha sido almacenado localmente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                abrirModalSmart(tipo);
            });
        });
    }

    document.getElementById('modalSmart').classList.add('active');
}

function cerrarModalSmart() {
    document.getElementById('modalSmart').classList.remove('active');
}

function abrirSimulacion(lugar) {
    const modal = document.getElementById('videoModal');
    const title = document.getElementById('modalTitle');
    title.innerText = 'Ruta hacia: ' + lugar;
    modal.classList.add('active');
}

function cerrarSimulacion() {
    document.getElementById('videoModal').classList.remove('active');
}


// Aqui trabaje io hoy 01 de junio
const botonesFiltro =
    document.querySelectorAll(".btn-filtro");
const tarjetas =
    document.querySelectorAll(".flip-card");
botonesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
        botonesFiltro.forEach(b =>
            b.classList.remove("activo")
        );
        btn.classList.add("activo");
        const filtro =
            btn.dataset.filter;
        tarjetas.forEach(card => {
            if (filtro === "all" || card.dataset.category === filtro) {
                card.style.display = "block";
                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform =
                        "scale(1)";
                }, 50);
            } else {
                card.style.opacity = "0";
                card.style.transform =
                    "scale(.8)";
                setTimeout(() => {
                    card.style.display =
                        "none";
                }, 300);
            }
        });
    });
});

// Esto es supuestamente para la mascota
const mascot = document.getElementById("careerMascot");
const bubble = document.getElementById("careerBubble");
if (mascot && bubble) {

    document.querySelectorAll(".flip-card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            const area = card.dataset.category;

            switch (area) {

                case "dactic":
                    bubble.innerHTML =
                        "💻 Hackeemos la NASA... digo, aprendamos a progaramar.";
                    break;

                case "dacip":
                    bubble.innerHTML =
                        "⚙️ Veo diagramas de flujo hasta en mis sueños";
                    break;

                case "daca":
                    bubble.innerHTML =
                        "🌳 Cultivemos el futuro... digo, primero veamos porque se murio la planta, de nuevo.";
                    break;

                case "dacac":
                    bubble.innerHTML =
                        "🏗️Diseñemos un gran edificio, que esta vez no se derrumbe si.";
                    break;

                default:
                    bubble.innerHTML =
                        "🎓 Explora las áreas de conocimiento.";
            }
            mascot.classList.add("show");
        });
        card.addEventListener("mouseleave", () => {
            mascot.classList.remove("show");
        });
    });
}
else {
    console.error(
        "No se encontró careerMascot o careerBubble en el HTML."
    );
}