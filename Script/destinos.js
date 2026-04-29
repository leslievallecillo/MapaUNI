// --- VARIABLES GLOBALES PARA ALMACENAR DATOS ---
let datosCompletos = null;

// --- SCRIPT PARA CARGAR EL NAVBAR ---
fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('menu-contenedor').innerHTML = data;
    const navDestinos = document.getElementById('nav-destinos');
    if (navDestinos) navDestinos.classList.add('activo');
  }).catch(() => console.log('Navbar no encontrado'));

// Funciones de navegación e interfaz general
window.cambiarVista = function(idVista) {
  document.querySelectorAll('.vista').forEach(vista => vista.classList.remove('activa'));
  document.getElementById(idVista).classList.add('activa');
  window.scrollTo(0, 0); 

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('activo'));
  if(event && event.currentTarget && event.currentTarget.classList) {
     event.currentTarget.classList.add('activo');
  }

  const navMovil = document.querySelector('nav.main-nav');
  if(navMovil && navMovil.classList.contains('active')) {
    navMovil.classList.remove('active');
  }
}

window.toggleMenuMovil = function() {
  document.querySelector('nav.main-nav').classList.toggle('active');
}

// -------------------------------------------------------------
// LÓGICA DE CARGA JSON Y CARRUSELES
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  
  fetch('Json/destinos.json')
    .then(response => {
        if(!response.ok) throw new Error("No se pudo cargar el JSON");
        return response.json();
    })
    .then(data => {
      // Guardamos los datos globalmente para usarlos en el modal de pisos
      datosCompletos = data;

      // Dibujamos las tarjetas principales
      renderizarCategoria(data.categorias.principales, 'track-principales');
      renderizarCategoria(data.categorias.laboratorios, 'track-laboratorios');
      renderizarCategoria(data.categorias.cafetines, 'track-cafetines');

      // Activamos el deslizamiento
      inicializarCarruseles();
    })
    .catch(error => {
        console.error("Error al cargar JSON:", error);
        alert("Error al cargar los datos. Verifica que el archivo JSON esté bien escrito y usa Live Server.");
    });

  function renderizarCategoria(items, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    let html = items.map(item => `
      <div class="card">
        <div class="card-img-container">
          <img src="${item.img}" alt="${item.nombre}" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x200/001f3f/ffffff?text=${encodeURIComponent(item.nombre)}';">
        </div>
        <div class="card-body">
          <h3>${item.nombre}</h3>
          <p>${item.desc}</p>
          <button class="btn-select" onclick="${item.tipo === 'complejo' ? `window.abrirModalPisos('${item.id}')` : `window.abrirSimulacion('${item.nombre}')`}">
            <span class="material-icons" style="font-size:18px; vertical-align: middle;">360</span> Entrar
          </button>
        </div>
      </div>
    `).join('');

    contenedor.innerHTML = html;
  }

  function inicializarCarruseles() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.anim-element').forEach((el) => observer.observe(el));

    document.querySelectorAll('.contenedor-slider').forEach(contenedor => {
      const sliderTrack = contenedor.querySelector('.carousel-track');
      const botonAnterior = contenedor.querySelector('.boton-slider.anterior');
      const botonSiguiente = contenedor.querySelector('.boton-slider.siguiente');

      if (sliderTrack && botonAnterior && botonSiguiente) {
        let cantidadDesplazamiento = 0;
        const card = sliderTrack.querySelector('.card');
        const anchoSlide = card ? card.offsetWidth + 20 : 320; 

        function actualizarVisibilidadBotones() {
          botonAnterior.style.display = cantidadDesplazamiento <= 0 ? 'none' : 'flex';
          botonSiguiente.style.display = cantidadDesplazamiento >= sliderTrack.scrollWidth - sliderTrack.clientWidth - 10 ? 'none' : 'flex';
        }

        botonSiguiente.addEventListener('click', () => {
          const desplazamientoMaximo = sliderTrack.scrollWidth - sliderTrack.clientWidth;
          cantidadDesplazamiento = Math.min(cantidadDesplazamiento + anchoSlide, desplazamientoMaximo);
          sliderTrack.scrollTo({ left: cantidadDesplazamiento, behavior: 'smooth' });
          setTimeout(actualizarVisibilidadBotones, 300);
        });

        botonAnterior.addEventListener('click', () => {
          cantidadDesplazamiento = Math.max(cantidadDesplazamiento - anchoSlide, 0);
          sliderTrack.scrollTo({ left: cantidadDesplazamiento, behavior: 'smooth' });
          setTimeout(actualizarVisibilidadBotones, 300);
        });

        sliderTrack.addEventListener('wheel', (e) => {
          sliderTrack.scrollLeft += e.deltaY;
          cantidadDesplazamiento = sliderTrack.scrollLeft;
          actualizarVisibilidadBotones();
        }, {passive: true});

        sliderTrack.addEventListener('scroll', () => {
          cantidadDesplazamiento = sliderTrack.scrollLeft;
          actualizarVisibilidadBotones();
        });

        actualizarVisibilidadBotones();
      }
    });
  }
});


// -------------------------------------------------------------
// LÓGICA MAPA GPS 
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const sitiosUNI = {
      "Edificio Rigoberto Lopez Perez": [12.131795792366901, -86.26988943520622],
      "Edificio Posgrado": [12.131009312952209, -86.27012610686415],
      "Laboratorios robotica": [12.131584651748083, -86.27005832378829], 
      "Laboratorios redes": [12.12897799279944, -86.26963729145416],
      "Cajero": [12.128732715683613, -86.26999540370072],
      "Cafetin el chele": [12.130425471825298, -86.27054166943908],
      "Cafetin El Duarte": [12.130516172843175, -86.26998792094867],
      "Cafetin EL Gueguense": [12.132155478384627, -86.2704627539127],
      "La mita": [12.12981213040029, -86.26985736622525],
      "Batidos Miranda": [12.13216668645582, -86.27065887811888],
      "Pabellon 1 IES": [12.131981369972088, -86.27086467145331],
      "Pabellon 2 IES": [12.132192465418543, -86.27090490458653],
      "Pabellon 3 IES": [12.132315713614327, -86.27097061870413],
      "Edificio Albert Einstein": [12.131887915661862, -86.2704855286818],
      "Laboratorios IES": [12.132152859333264, -86.27083395225783],
      "Copias UNI": [12.13053395719282, -86.27045150893927],
      "Autoservicio de impresiones": [12.129091217122017, -86.27057892767442],
      "Entrada Principal": [12.129222488740314, -86.27027854062317],
      "Entrada IES": [12.13144814009071, -86.27106191565036],
      "Parqueo Posgrado": [12.130806261883121, -86.27004596357038],
      "Parqueo edificio rigoberto": [12.132240605882307, -86.26940334418464],
      "Registro academico": [12.129346707202687, -86.27020754103975],
      "Edificio Arquitectura": [12.129290529982416, -86.26991042954135],
      "Edificio Quimica": [12.12891915159251, -86.26961484455204],
      "Piscina": [12.12945410736998, -86.2699139108461],
      "Auditorio Salomon de la Selva": [12.131729141982937, -86.27069090194155],
      "Edificio Carlos Santos Berroterán": [12.131721857663178, -86.27102664352297]
  };

  let mapa, userMarker, markerPulse, enrutadorActual;
  let userLocation = null;
  let instruccionHablada = "";

  function hablar(texto) {
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); 
          let msj = new SpeechSynthesisUtterance(texto);
          msj.lang = 'es-ES'; 
          window.speechSynthesis.speak(msj);
      }
  }

  if (document.getElementById('uni-mapa')) {
      const capaSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
      const capaOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });

      mapa = L.map('uni-mapa', { center: [12.131932, -86.269389], zoom: 17, layers: [capaSatelite] });
      L.control.layers({ "Vista Satélite": capaSatelite, "Calles": capaOSM }).addTo(mapa);

      const select = document.getElementById('destino');
      for (let nombre in sitiosUNI) {
          let option = document.createElement('option');
          option.value = nombre; option.text = nombre;
          if(select) select.appendChild(option);
          if(sitiosUNI[nombre][0] !== 0) {
              L.marker(sitiosUNI[nombre]).bindPopup(`<strong style="color:#001f3f;">${nombre}</strong>`).addTo(mapa);
          }
      }

      const btnCentrar = document.getElementById('btnCentrar');
      if(btnCentrar) {
          btnCentrar.onclick = () => { if(userLocation) mapa.setView(userLocation, 19); };
      }

      const btnActivarGPS = document.getElementById('btnActivarGPS');
      if(btnActivarGPS) {
          btnActivarGPS.onclick = function() {
              let utterance = new SpeechSynthesisUtterance(""); window.speechSynthesis.speak(utterance); 
              if (!navigator.geolocation) return Swal.fire("Error", "GPS no soportado.", "error");

              Swal.fire({ title: 'Buscando tu ubicación...', didOpen: () => { Swal.showLoading(); }});

              navigator.geolocation.watchPosition(
                  (pos) => {
                      Swal.close(); 
                      userLocation = [pos.coords.latitude, pos.coords.longitude];
                      const statusGPS = document.getElementById('statusGPS');
                      if(statusGPS) statusGPS.innerHTML = `<span style="color: #28a745; font-weight: bold;"><i class="fa-solid fa-location-dot"></i> GPS Conectado.</span>`;
                      if(btnCentrar) btnCentrar.style.display = 'inline-flex'; 

                      if (!userMarker) {
                          markerPulse = L.marker(userLocation, { icon: L.divIcon({className: 'gps-pulse', iconSize:[40,40], iconAnchor:[20,20]}) }).addTo(mapa);
                          userMarker = L.marker(userLocation, { icon: L.divIcon({className: 'user-icon', html: '<div style="background: #00c8f5; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white;"></div>'}) }).addTo(mapa).bindPopup("Tú");
                          mapa.setView(userLocation, 18);
                          hablar("GPS conectado.");
                      } else {
                          userMarker.setLatLng(userLocation);
                          markerPulse.setLatLng(userLocation);
                      }

                      if (enrutadorActual) {
                          enrutadorActual.setWaypoints([
                              L.latLng(userLocation[0], userLocation[1]),
                              enrutadorActual.getWaypoints()[1].latLng
                          ]);
                      }
                  },
                  (err) => { Swal.fire("Enciende tu ubicación", "Permite el acceso al GPS.", "warning"); },
                  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
              );
          };
      }

      const btnIr = document.getElementById('btnIr');
      if(btnIr) {
          btnIr.onclick = function() {
              const destinoNombre = document.getElementById('destino').value;
              if (!userLocation) return Swal.fire("Atención", "Primero activa el GPS.", "info");
              if (!destinoNombre) return Swal.fire("Atención", "Selecciona un destino.", "info");
              
              const destinoCoords = sitiosUNI[destinoNombre];
              if (destinoCoords[0] === 0) return Swal.fire("Error", "Faltan coordenadas.", "error");

              if (enrutadorActual) mapa.removeControl(enrutadorActual);

              enrutadorActual = L.Routing.control({
                  waypoints: [
                      L.latLng(userLocation[0], userLocation[1]),
                      L.latLng(destinoCoords[0], destinoCoords[1])
                  ],
                  router: L.Routing.osrmv1({ language: 'es', profile: 'foot' }),
                  show: false, 
                  createMarker: function() { return null; }, 
                  lineOptions: { styles: [{color: '#00c8f5', opacity: 0.9, weight: 7}] } 
              }).addTo(mapa);

              enrutadorActual.on('routesfound', function(e) {
                  let ruta = e.routes[0];
                  let maniobras = ruta.instructions; 
                  let pasoActual = maniobras[0];
                  let txtInstruccion = pasoActual.text;
                  let distPaso = Math.round(pasoActual.distance); 

                  const infoRuta = document.getElementById('infoRuta');
                  const instruccionActual = document.getElementById('instruccionActual');
                  const distanciaTexto = document.getElementById('distanciaTexto');

                  if(infoRuta) infoRuta.style.display = 'block';
                  if(instruccionActual) instruccionActual.innerText = "➡ " + txtInstruccion;
                  if(distanciaTexto) distanciaTexto.innerText = `En ${distPaso} metros. (Faltan ${Math.round(ruta.summary.totalDistance)}m en total)`;

                  let fraseVoz = `${txtInstruccion}. Continúa por ${distPaso} metros.`;
                  
                  if (txtInstruccion !== instruccionHablada) {
                      hablar(fraseVoz);
                      instruccionHablada = txtInstruccion;
                  }

                  if (ruta.summary.totalDistance <= 15) {
                      hablar(`Has llegado a tu destino: ${destinoNombre}`);
                      Swal.fire({ icon: 'success', title: '¡Llegaste!', text: `Estás en ${destinoNombre}.`, confirmButtonColor: '#28a745' });
                      mapa.removeControl(enrutadorActual);
                      enrutadorActual = null;
                      if(infoRuta) infoRuta.style.display = 'none';
                  }
              });

              enrutadorActual.on('routingerror', function() {
                  Swal.fire({
                      icon: 'warning',
                      title: 'Zona sin mapear',
                      text: 'Los pasillos no están en el servidor global. Sigue la línea recta.',
                      confirmButtonColor: '#001f3f'
                  });
                  mapa.removeControl(enrutadorActual);
                  L.polyline([userLocation, destinoCoords], {color: '#00c8f5', weight: 6, dashArray: '10'}).addTo(mapa);
                  hablar("Dirígete hacia la línea marcada en tu pantalla.");
              });
          };
      }
  }
});

// -------------------------------------------------------------
// FUNCIONES DE MODALES Y LÓGICA DE AULAS DINÁMICA
// -------------------------------------------------------------
let edificioActualId = "";

window.abrirSimulacion = function(lugar) {
  const modal = document.getElementById('videoModal');
  const title = document.getElementById('modalTitle');
  if(title) title.innerText = 'Ruta hacia: ' + lugar;
  if(modal) modal.classList.add('active');
}
window.cerrarSimulacion = function() {
  const modal = document.getElementById('videoModal');
  if(modal) modal.classList.remove('active');
}

// Modificado para inyectar los botones de los pisos dinámicamente desde el JSON
window.abrirModalPisos = function(edificioId) {
  edificioActualId = edificioId || "rigoberto";
  const modal = document.getElementById('modalPisos');
  if(modal) modal.classList.add('active');
  window.cambiarPestanaRigoberto('info'); 
  
  if(datosCompletos && datosCompletos.detallesEdificios && datosCompletos.detallesEdificios[edificioActualId]) {
      const pisosData = datosCompletos.detallesEdificios[edificioActualId].pisos;
      const trackPisos = document.getElementById('track-pisos');
      if(trackPisos) {
          trackPisos.innerHTML = "";
          pisosData.forEach(piso => {
              let btn = document.createElement('button');
              btn.className = 'piso-btn';
              btn.innerText = piso.label.toUpperCase();
              btn.onclick = function() { window.seleccionarPiso(piso.id, piso.label, this); };
              trackPisos.appendChild(btn);
          });
      }
  }
}

window.cerrarModalPisos = function() {
  const modal = document.getElementById('modalPisos');
  if(modal) modal.classList.remove('active');
  const opcionesAula = document.getElementById('opciones-aula');
  if(opcionesAula) opcionesAula.style.display = 'none';
  document.querySelectorAll('.piso-btn').forEach(b => b.classList.remove('activo'));
  const trackPisos = document.getElementById('track-pisos');
  if(trackPisos) trackPisos.scrollTo({ left: 0 });
}

window.cambiarPestanaRigoberto = function(pestana) {
  const btnInfo = document.getElementById('btn-tab-info');
  const btnAulas = document.getElementById('btn-tab-aulas');
  const contenidoInfo = document.getElementById('contenido-info-rigoberto');
  const contenidoAulas = document.getElementById('contenido-aulas-rigoberto');

  if(pestana === 'info') {
    if(contenidoInfo) contenidoInfo.style.display = 'block';
    if(contenidoAulas) contenidoAulas.style.display = 'none';
    if(btnInfo) { btnInfo.style.background = 'var(--primary-color)'; btnInfo.style.color = 'white'; }
    if(btnAulas) { btnAulas.style.background = '#e0e0e0'; btnAulas.style.color = 'var(--text-gray)'; }
  } else {
    if(contenidoInfo) contenidoInfo.style.display = 'none';
    if(contenidoAulas) contenidoAulas.style.display = 'block';
    if(btnAulas) { btnAulas.style.background = 'var(--primary-color)'; btnAulas.style.color = 'white'; }
    if(btnInfo) { btnInfo.style.background = '#e0e0e0'; btnInfo.style.color = 'var(--text-gray)'; }
  }
}

window.desplazarCarruselPisos = function(cantidad) {
  const track = document.getElementById('track-pisos');
  if(track) track.scrollBy({ left: cantidad, behavior: 'smooth' });
}

// Modificado para inyectar las aulas de ese piso específico desde el JSON
window.seleccionarPiso = function(pisoId, pisoLabel, botonHtml) {
  document.querySelectorAll('.piso-btn').forEach(b => b.classList.remove('activo'));
  if(botonHtml) botonHtml.classList.add('activo');
  
  const opcionesAula = document.getElementById('opciones-aula');
  if(opcionesAula) opcionesAula.style.display = 'block';
  
  const inputPiso = document.getElementById('input-piso-actual');
  if(inputPiso) inputPiso.value = pisoLabel;

  const contenedorTarjetas = document.getElementById('contenedor-tarjetas-aula');
  if(!contenedorTarjetas) return;
  
  contenedorTarjetas.innerHTML = "";

  if(datosCompletos && datosCompletos.detallesEdificios[edificioActualId] && datosCompletos.detallesEdificios[edificioActualId].aulas[pisoId]) {
      // Extraemos las aulas del lado seleccionado en el combo box
      const selectLado = document.getElementById('select-lado-aula');
      const ladoActual = selectLado ? selectLado.value : 'A';
      
      const aulasDelPiso = datosCompletos.detallesEdificios[edificioActualId].aulas[pisoId][ladoActual] || [];

      if(aulasDelPiso.length === 0) {
          contenedorTarjetas.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">No hay aulas registradas en el Lado ${ladoActual} de este piso.</p>`;
          return;
      }

      aulasDelPiso.forEach(aula => {
          contenedorTarjetas.innerHTML += `
              <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                  <h4 style="margin-bottom: 12px; font-size: 16px;">${aula.nombre}</h4>
                  <button onclick="window.abrirModalAulaVirtual('${aula.nombre}')" style="background: var(--accent-color); color: var(--primary-color); border: none; padding: 10px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; transition: 0.3s;">
                      <span class="material-icons" style="font-size: 18px; vertical-align: bottom; margin-right: 5px;">vrpano</span> Entrar (360)
                  </button>
              </div>
          `;
      });
  } else {
      contenedorTarjetas.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">Datos no disponibles para este piso aún.</p>`;
  }
}

// Listener para que cuando cambies "Lado A" a "Lado B" se actualicen las aulas solas
document.addEventListener('change', function(e) {
  if(e.target && e.target.id === 'select-lado-aula'){
      const btnActivo = document.querySelector('.piso-btn.activo');
      if(btnActivo) {
          btnActivo.click(); // Re-dispara el evento para volver a dibujar las aulas
      }
  }
});


window.abrirModalAulaVirtual = function(aula) {
  const titulo = document.getElementById('titulo-aula-virtual');
  if(titulo) titulo.innerText = 'Destino: ' + aula;
  window.cerrarModalPisos();
  const modal = document.getElementById('modalAulaVirtual');
  if(modal) modal.classList.add('active');
}

window.cerrarModalAulaVirtual = function() {
  const modal = document.getElementById('modalAulaVirtual');
  if(modal) modal.classList.remove('active');
}

// Cerrar haciendo clic afuera
document.addEventListener('click', function(e) {
  const mVideo = document.getElementById('videoModal');
  const mPisos = document.getElementById('modalPisos');
  const mAula = document.getElementById('modalAulaVirtual');
  if(e.target === mVideo) window.cerrarSimulacion();
  if(e.target === mPisos) window.cerrarModalPisos();
  if(e.target === mAula) window.cerrarModalAulaVirtual();
});