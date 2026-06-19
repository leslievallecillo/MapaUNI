// --- VARIABLES GLOBALES PARA ALMACENAR DATOS ---
let datosCompletos = null;
let indicacionesData = null;
let edificioActualId = "";

// Nueva función para transformar las barras de búsqueda en select (Combo box)
const destinosGlobales = [
  "Edificio Rigoberto Lopez Perez", "Edificio Posgrado", "Laboratorios robotica",
  "Laboratorios redes", "Cajero Automático", "Cafetería El Chele", "Cafetería El Duarte",
  "Cafetería El Güegüense", "La mita", "Batidos Miranda", "Pabellon 1 IES",
  "Pabellon 2 IES", "Pabellon 3 IES", "Edificio Albert Einstein", "Laboratorios IES",
  "Copias UNI", "Autoservicio de impresiones", "Entrada Principal", "Entrada IES",
  "Parqueo Posgrado", "Parqueo edificio rigoberto", "Registro academico",
  "Edificio Arquitectura", "Edificio Quimica", "Piscina", "Auditorio Salomon de la Selva",
  "Edificio Carlos Santos Berroterán", "Biblioteca Central", "RapiCopias Castellón"
].sort();

window.manejarSeleccionDestino = function (destino) {
  if (!destino) return;
  if (document.getElementById('vista-destinos') || window.location.pathname.includes('destinos.html')) {
    // Redirigir directamente al GPS en lugar del modal de video roto
    const selectDestino = document.getElementById("destino");
    const btnIr = document.getElementById("btnIr");

    if (selectDestino && btnIr) {
      // Verificar si la opción existe, si no, crearla temporalmente para que no de error
      let optionExists = Array.from(selectDestino.options).some(opt => opt.value === destino);
      if (!optionExists) {
        let opt = document.createElement('option');
        opt.value = destino;
        opt.text = destino;
        selectDestino.appendChild(opt);
      }

      selectDestino.value = destino;
      btnIr.click();
      document.getElementById("navegacion-asistida").scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (typeof window.abrirSimulacion === 'function') window.abrirSimulacion(destino);
      else abrirSimulacion(destino);
    }
  } else {
    localStorage.setItem('destinoBuscadoSimple', destino);
    window.location.href = 'destinos.html';
  }
};

window.transformarBuscadoresEnSelect = function () {
  const selectInicio = document.getElementById('busquedaDestino');
  if (selectInicio && selectInicio.tagName === 'SELECT' && selectInicio.options.length <= 1) {
    destinosGlobales.forEach(destino => {
      const opt = document.createElement('option');
      opt.value = destino;
      opt.text = destino;
      selectInicio.appendChild(opt);
    });

    selectInicio.addEventListener('change', function () {
      if (this.value) {
        window.manejarSeleccionDestino(this.value);
        this.value = "";
      }
    });
  }

  const selectModal = document.getElementById('busquedaDestinoModal');
  if (selectModal && selectModal.options.length <= 1) {
    destinosGlobales.forEach(destino => {
      const opt = document.createElement('option');
      opt.value = destino;
      opt.text = destino;
      selectModal.appendChild(opt);
    });

    selectModal.addEventListener('change', function () {
      if (this.value) {
        window.manejarSeleccionDestino(this.value);
        this.value = "";
      }
    });
  }
};

// --- SCRIPT PARA CARGAR EL NAVBAR ---
fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('menu-contenedor').innerHTML = data;
    const navDestinos = document.getElementById('nav-destinos');
    if (navDestinos) navDestinos.classList.add('activo');

    window.transformarBuscadoresEnSelect();
  }).catch(() => console.log('Navbar no encontrado'));

window.buscarDestinoModal = function () {
  const selectModal = document.getElementById('busquedaDestinoModal');
  if (selectModal && selectModal.value) {
    window.manejarSeleccionDestino(selectModal.value);

    const modal = document.getElementById('searchModal');
    const overlay = document.getElementById('searchOverlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    selectModal.value = "";
  }
};

window.toggleSearchModal = function () {
  const modal = document.getElementById('searchModal');
  const overlay = document.getElementById('searchOverlay');
  if (modal) modal.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
  window.transformarBuscadoresEnSelect();
};

// Funciones de navegación e interfaz general
window.cambiarVista = function (idVista) {
  document.querySelectorAll('.vista').forEach(vista => vista.classList.remove('activa'));
  document.getElementById(idVista).classList.add('activa');
  window.scrollTo(0, 0);

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('activo'));
  if (event && event.currentTarget && event.currentTarget.classList) {
    event.currentTarget.classList.add('activo');
  }

  const navMovil = document.querySelector('nav.main-nav');
  if (navMovil && navMovil.classList.contains('active')) {
    navMovil.classList.remove('active');
  }
}

window.toggleMenuMovil = function () {
  document.querySelector('nav.main-nav').classList.toggle('active');
}

// -------------------------------------------------------------
// LÓGICA DE CARGA JSON (A PRUEBA DE GITHUB PAGES)
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {

  const rutasPosibles = [
    './Json/destinos.json',
    './json/destinos.json',
    'Json/destinos.json',
    'json/destinos.json',
    '../Json/destinos.json',
    '../json/destinos.json'
  ];

  let dataCargada = null;

  for (const ruta of rutasPosibles) {
    try {
      const response = await fetch(ruta);
      if (response.ok) {
        dataCargada = await response.json();
        console.log("JSON cargado exitosamente desde:", ruta);
        break;
      }
    } catch (e) {
      // Si falla, el ciclo continúa
    }
  }

  if (!dataCargada) {
    console.error("No se pudo cargar el archivo destinos.json en ninguna ruta.");
    return;
  }

  datosCompletos = dataCargada;
  renderizarCategoria(datosCompletos.categorias.principales, 'track-principales');
  renderizarCategoria(datosCompletos.categorias.laboratorios, 'track-laboratorios');
  renderizarCategoria(datosCompletos.categorias.cafetines, 'track-cafetines');
  inicializarCarruseles();

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
          <button class="btn-select" onclick="${item.tipo === 'complejo' ? `window.abrirModalPisos('${item.id}')` : `window.abrirSimulacion('${item.nombre}', '${item.media || item.img}', '${item.tipoMedia || 'imagen'}', '${item.id}')`}">
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
        }, { passive: true });

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
document.addEventListener('DOMContentLoaded', function () {
  let mapa;
  let userMarker;
  let markerPulse;
  let lineaRuta = null;
  let rutaActiva = null;
  let pasoActual = 0;

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
    "Entrada Trasera": [12.132836010391078, -86.26883320255943],
    "Parqueo Posgrado": [12.130806261883121, -86.27004596357038],
    "Parqueo edificio rigoberto": [12.132240605882307, -86.26940334418464],
    "Registro academico": [12.129346707202687, -86.27020754103975],
    "Edificio Arquitectura": [12.129290529982416, -86.26991042954135],
    "Edificio Quimica": [12.12891915159251, -86.26961484455204],
    "Piscina": [12.12945410736998, -86.2699139108461],
    "Auditorio Salomon de la Selva": [12.131729141982937, -86.27069090194155],
    "Edificio Carlos Santos Berroterán": [12.131721857663178, -86.27102664352297],
    "Biblioteca": [12.131143624844496, -86.27087762197696],
    "Cafetin El Deportivo": [12.130877631060027, -86.27074259503898],
    "Cafetin El Comal": [12.129897227413625, -86.27048857927917],
    "Cafetin La Fritanga": [12.130201, -86.270503]
  };

  const rutasUNI = {
    //ENTRADA PRINCIPAL

    "Entrada Principal|Edificio Rigoberto Lopez Perez": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Entrada IES"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"]
    ],
    "Entrada Principal|Registro academico": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"]
    ],
    "Entrada Principal|Edificio Arquitectura": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Edificio Arquitectura"]
    ],
    "Entrada Principal|Edificio Quimica": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Edificio Quimica"]
    ],
    "Entrada Principal|Laboratorios redes": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Laboratorios redes"]
    ],
    "Entrada Principal|Edificio Posgrado": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Piscina"],
      sitiosUNI["La mita"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Edificio Posgrado"]
    ],
    "Entrada Principal|Auditorio Salomon de la Selva": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"]
    ],
    "Entrada Principal|Edificio Carlos Santos Berroterán": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Edificio Carlos Santos Berroterán"]
    ],
    "Entrada Principal|Edificio Albert Einstein": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Edificio Albert Einstein"]
    ],
    "Entrada Principal|Pabellon 1 IES": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"]
    ],
    "Entrada Principal|Pabellon 2 IES": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"]
    ],
    "Entrada Principal|Pabellon 3 IES": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"],
      sitiosUNI["Pabellon 3 IES"]
    ],
    "Entrada Principal|Laboratorios IES": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Laboratorios IES"]
    ],
    "Entrada Principal|Entrada Principal": [
      sitiosUNI["Entrada Principal"]
    ],
    "Entrada Principal|Biblioteca": [
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"]
    ],


    //ENTRADA IES

    "Entrada IES|Edificio Arquitectura": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Edificio Arquitectura"]
    ],
    "Entrada IES|Edificio Albert Einstein": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Edificio Albert Einstein"]
    ],
    "Entrada IES|Edificio Carlos Santos Berroterán": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Edificio Carlos Santos Berroterán"]
    ],
    "Entrada IES|Auditorio Salomon de la Selva": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Auditorio Salomon de la Selva"]
    ],
    "Entrada IES|Edificio Rigoberto Lopez Perez": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"]
    ],
    "Entrada IES|Biblioteca": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Biblioteca"]
    ],
    "Entrada IES|Pabellon 1 IES": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"]
    ],
    "Entrada IES|Pabellon 2 IES": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"]
    ],
    "Entrada IES|Pabellon 3 IES": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"],
      sitiosUNI["Pabellon 3 IES"]
    ],
    "Entrada IES|Laboratorios IES": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Laboratorios IES"]
    ],
    "Entrada IES|Registro academico": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Registro academico"]
    ],
    "Entrada IES|Edificio Quimica": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Edificio Quimica"]
    ],
    "Entrada IES|Laboratorios redes": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Laboratorios redes"]
    ],
    "Entrada IES|Edificio Posgrado": [
      sitiosUNI["Entrada IES"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Edificio Posgrado"]
    ],
    "Entrada IES|Entrada IES": [
      sitiosUNI["Entrada IES"]
    ],

    //ENTRADA TRASERA
    "Entrada Trasera|Edificio Rigoberto Lopez Perez": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"]
    ],
    "Entrada Trasera|Edificio Albert Einstein": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"]

    ],
    "Entrada Trasera|Auditorio Salomon de la Selva": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Auditorio Salomon de la Selva"]
    ],
    "Entrada Trasera|Edificio Carlos Santos Berroterán": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Edificio Carlos Santos Berroterán"]
    ],
    "Entrada Trasera|Pabellon 1 IES": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"]
    ],
    "Entrada Trasera|Pabellon 2 IES": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"]
    ],
    "Entrada Trasera|Pabellon 3 IES": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"],
      sitiosUNI["Pabellon 3 IES"]
    ],
    "Entrada Trasera|Laboratorios IES": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Laboratorios IES"]
    ],
    "Entrada Trasera|Biblioteca": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Biblioteca"]
    ],
    "Entrada Trasera|Edificio Posgrado": [
      sitiosUNI["Entrada Trasera"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"]
    ],


    // EDIFICIO RIGOBERTO LOPEZ PEREZ
    "Edificio Rigoberto Lopez Perez|Cafetin el chele": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Cafetin el chele"]
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin La Fritanga": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin La Fritanga"]
    ],
    "Edificio Rigoberto Lopez Perez|Laboratorios redes": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Laboratorios redes"]
    ],
    "Edificio Rigoberto Lopez Perez|Copias UNI": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Copias UNI"]
    ],
    "Edificio Rigoberto Lopez Perez|Cajero": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cajero"]
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin EL Gueguense": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Cafetin EL Gueguense"]
    ],
    "Edificio Rigoberto Lopez Perez|Batidos Miranda": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Batidos Miranda"]
    ],

    "Edificio Rigoberto Lopez Perez|Cafetin El Duarte": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"]
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin El Deportivo": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"]
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin El Comal": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin El Comal"]
    ],
    "Edificio Rigoberto Lopez Perez|Biblioteca": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Biblioteca"]
    ],
    "Edificio Rigoberto Lopez Perez|Auditorio Salomon de la Selva": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Auditorio Salomon de la Selva"]
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Posgrado": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"]
    ],
    "Edificio Rigoberto Lopez Perez|La mita": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"]
    ],
    "Edificio Rigoberto Lopez Perez|Pabellon 1 IES": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"]
    ],
    "Edificio Rigoberto Lopez Perez|Pabellon 2 IES": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"]
    ],
    "Edificio Rigoberto Lopez Perez|Pabellon 3 IES": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"],
      sitiosUNI["Pabellon 3 IES"]
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Albert Einstein": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"]
    ],
    "Edificio Rigoberto Lopez Perez|Laboratorios IES": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Laboratorios IES"]
    ],
    "Edificio Rigoberto Lopez Perez|Autoservicio de impresiones": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Autoservicio de impresiones"]
    ],
    "Edificio Rigoberto Lopez Perez|Entrada Principal": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Entrada Principal"]
    ],
    "Edificio Rigoberto Lopez Perez|Entrada IES": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Entrada IES"]
    ],
    "Edificio Rigoberto Lopez Perez|Entrada Trasera": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Parqueo edificio rigoberto"],
      sitiosUNI["Entrada Trasera"]
    ],
    "Edificio Rigoberto Lopez Perez|Parqueo edificio rigoberto": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Parqueo edificio rigoberto"]
    ],
    "Edificio Rigoberto Lopez Perez|Parqueo Posgrado": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Parqueo Posgrado"]
    ],
    "Edificio Rigoberto Lopez Perez|Registro academico": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"]
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Arquitectura": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Edificio Arquitectura"]
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Quimica": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Edificio Quimica"]
    ],
    "Edificio Rigoberto Lopez Perez|Piscina": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Piscina"]
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Carlos Santos Berroterán": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Edificio Carlos Santos Berroterán"]
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Rigoberto Lopez Perez": [
      sitiosUNI["Edificio Rigoberto Lopez Perez"]

    ],
    // EDIFICIO POSGRADO


    "Edificio Posgrado|Cafetin el chele": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Cafetin el chele"]
    ],

    "Edificio Posgrado|Cafetin La Fritanga": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin La Fritanga"]
    ],

    "Edificio Posgrado|Laboratorios redes": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Laboratorios redes"]
    ],

    "Edificio Posgrado|Copias UNI": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Copias UNI"]
    ],

    "Edificio Posgrado|Cajero": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cajero"]
    ],

    "Edificio Posgrado|Cafetin EL Gueguense": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Cafetin EL Gueguense"]
    ],

    "Edificio Posgrado|Batidos Miranda": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Batidos Miranda"]
    ],

    "Edificio Posgrado|Cafetin El Duarte": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"]
    ],

    "Edificio Posgrado|Cafetin El Deportivo": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Deportivo"]
    ],

    "Edificio Posgrado|Cafetin El Comal": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin El Comal"]
    ],

    "Edificio Posgrado|Biblioteca": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Biblioteca"]
    ],

    "Edificio Posgrado|Auditorio Salomon de la Selva": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Auditorio Salomon de la Selva"]
    ],

    "Edificio Posgrado|Edificio Rigoberto Lopez Perez": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"]
    ],

    "Edificio Posgrado|La mita": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"]
    ],

    "Edificio Posgrado|Pabellon 1 IES": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"]
    ],

    "Edificio Posgrado|Pabellon 2 IES": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"]
    ],

    "Edificio Posgrado|Pabellon 3 IES": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"],
      sitiosUNI["Pabellon 3 IES"]
    ],

    "Edificio Posgrado|Edificio Albert Einstein": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Albert Einstein"]
    ],

    "Edificio Posgrado|Laboratorios IES": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Laboratorios IES"]
    ],

    "Edificio Posgrado|Autoservicio de impresiones": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Autoservicio de impresiones"]
    ],

    "Edificio Posgrado|Entrada Principal": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Entrada Principal"]
    ],

    "Edificio Posgrado|Entrada IES": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Entrada IES"]
    ],

    "Edificio Posgrado|Entrada Trasera": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Parqueo edificio rigoberto"],
      sitiosUNI["Entrada Trasera"]
    ],

    "Edificio Posgrado|Parqueo edificio rigoberto": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Parqueo edificio rigoberto"]
    ],

    "Edificio Posgrado|Parqueo Posgrado": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Parqueo Posgrado"]
    ],

    "Edificio Posgrado|Registro academico": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"]
    ],

    "Edificio Posgrado|Edificio Arquitectura": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Edificio Arquitectura"]
    ],

    "Edificio Posgrado|Edificio Quimica": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Edificio Quimica"]
    ],

    "Edificio Posgrado|Piscina": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["La mita"],
      sitiosUNI["Piscina"]
    ],

    "Edificio Posgrado|Edificio Carlos Santos Berroterán": [
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Edificio Carlos Santos Berroterán"]
    ],

    "Edificio Posgrado|Edificio Posgrado": [
      sitiosUNI["Edificio Posgrado"]
    ],


    // EDIFICIO DE ARQUITECTURA
    "Edificio Arquitectura|Piscina": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Piscina"]
    ],
    "Edificio Arquitectura|Registro academico": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"]
    ],
    "Edificio Arquitectura|Edificio Quimica": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Edificio Quimica"]
    ],
    "Edificio Arquitectura|Entrada Principal": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Entrada Principal"]
    ],
    "Edificio Arquitectura|Laboratorios redes": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Laboratorios redes"]
    ],
    "Edificio Arquitectura|Cajero": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Cajero"]
    ],
    "Edificio Arquitectura|Autoservicio de impresiones": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Entrada Principal"],
      sitiosUNI["Autoservicio de impresiones"]
    ],
    "Edificio Arquitectura|La mita": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Piscina"],
      sitiosUNI["La mita"]
    ],
    "Edificio Arquitectura|Cafetin El Comal": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"]
    ],
    "Edificio Arquitectura|Cafetin La Fritanga": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"]
    ],
    "Edificio Arquitectura|Cafetin el chele": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"]
    ],
    "Edificio Arquitectura|Copias UNI": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Copias UNI"]
    ],
    "Edificio Arquitectura|Cafetin El Duarte": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Duarte"]
    ],
    "Edificio Arquitectura|Parqueo Posgrado": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Piscina"],
      sitiosUNI["La mita"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["Parqueo Posgrado"]
    ],
    "Edificio Arquitectura|Edificio Posgrado": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Piscina"],
      sitiosUNI["La mita"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Edificio Posgrado"]
    ],
    "Edificio Arquitectura|Cafetin El Deportivo": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"]
    ],
    "Edificio Arquitectura|Biblioteca": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"]
    ],
    "Edificio Arquitectura|Entrada IES": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Entrada IES"]
    ],
    "Edificio Arquitectura|Edificio Rigoberto Lopez Perez": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Piscina"],
      sitiosUNI["La mita"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"]
    ],
    "Edificio Arquitectura|Parqueo edificio rigoberto": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Piscina"],
      sitiosUNI["La mita"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Parqueo edificio rigoberto"]
    ],
    "Edificio Arquitectura|Entrada Trasera": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Piscina"],
      sitiosUNI["La mita"],
      sitiosUNI["Cafetin El Duarte"],
      sitiosUNI["Parqueo Posgrado"],
      sitiosUNI["Edificio Posgrado"],
      sitiosUNI["Edificio Rigoberto Lopez Perez"],
      sitiosUNI["Parqueo edificio rigoberto"],
      sitiosUNI["Entrada Trasera"]
    ],
    "Edificio Arquitectura|Edificio Carlos Santos Berroterán": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Edificio Carlos Santos Berroterán"]
    ],
    "Edificio Arquitectura|Auditorio Salomon de la Selva": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"]
    ],
    "Edificio Arquitectura|Edificio Albert Einstein": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Edificio Albert Einstein"]
    ],
    "Edificio Arquitectura|Batidos Miranda": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Batidos Miranda"]
    ],
    "Edificio Arquitectura|Cafetin EL Gueguense": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Edificio Albert Einstein"],
      sitiosUNI["Cafetin EL Gueguense"]
    ],
    "Edificio Arquitectura|Pabellon 1 IES": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"]
    ],
    "Edificio Arquitectura|Pabellon 2 IES": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"]
    ],
    "Edificio Arquitectura|Pabellon 3 IES": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Pabellon 2 IES"],
      sitiosUNI["Pabellon 3 IES"]
    ],
    "Edificio Arquitectura|Laboratorios IES": [
      sitiosUNI["Edificio Arquitectura"],
      sitiosUNI["Registro academico"],
      sitiosUNI["Cafetin El Comal"],
      sitiosUNI["Cafetin La Fritanga"],
      sitiosUNI["Cafetin el chele"],
      sitiosUNI["Cafetin El Deportivo"],
      sitiosUNI["Biblioteca"],
      sitiosUNI["Auditorio Salomon de la Selva"],
      sitiosUNI["Pabellon 1 IES"],
      sitiosUNI["Laboratorios IES"]
    ],
    "Edificio Arquitectura|Edificio Arquitectura": [
      sitiosUNI["Edificio Arquitectura"]
    ]


  };

  const instruccionesUNI = {

    // ENTRADA PRINCIPAL
    "Entrada Principal|Edificio Rigoberto Lopez Perez": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta Registro Académico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 116 metros hasta llegar al Cafetín El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Continúa 51 metros hasta llegar al Cafetín El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Sigue recto 40 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 40 metros hasta llegar a la entrada IES" },
      { punto: sitiosUNI["Entrada IES"], texto: "Gira a la derecha y camina 100 metros hasta llegar al edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Registro academico": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta Registro Académico" },
      { punto: sitiosUNI["Registro academico"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Edificio Arquitectura": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 36 metros hasta llegar al Edificio de Arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Edificio Quimica": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 62 metros hasta llegar al Edificio de Quimica" },
      { punto: sitiosUNI["Edificio Quimica"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Laboratorios redes": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 60 metros hasta llegar a los Laboratorios redes" },
      { punto: sitiosUNI["Laboratorios redes"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Edificio Posgrado": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 43 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Camina 66 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 92 metros hasta llegar al Cafetin El Duarte " },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 23 metros hasta llegar al Parqueo Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 26 metros hasta llegar al Edificio Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Auditorio Salomon de la Selva": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Edificio Carlos Santos Berroterán": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 63 metros hasta llegar al Edificio Carlos Santos Berroterán" },
      { punto: sitiosUNI["Edificio Carlos Santos Berroterán"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Edificio Albert Einstein": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 33 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Pabellon 1 IES": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Pabellon 2 IES": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Pabellon 3 IES": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 3 IES" },
      { punto: sitiosUNI["Pabellon 3 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Laboratorios IES": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 donde estan los Laboratorios IES" },
      { punto: sitiosUNI["Laboratorios IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Principal|Entrada Principal": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Ya estas ubicado en la Entrada Principal" }
    ],
    "Entrada Principal|Biblioteca": [
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 8 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Has llegado a tu destino" },
    ],

    // ENTRADA IES
    "Entrada IES|Edificio Arquitectura": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 46 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 44 metros hasta el cafetin el deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Continúa 53 metros recto hasta el Cafetín El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Sigue 51 metros de frente hasta llegar al Cafetín El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Continúa 63 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Gira a la derecha y camina 31 metros hasta llegar al edificio de arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Has llegado al Edificio de Arquitectura" }
    ],
    "Entrada IES|Edificio Albert Einstein": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 69 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Has llegado al Edificio Albert Einstein" }
    ],
    "Entrada IES|Auditorio Salomon de la Selva": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 41 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Has llegado al Auditorio Salomon de la Selva" }
    ],
    "Entrada IES|Edificio Carlos Santos Berroterán": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 28 metros hasta llegar al Edificio Carlos Santos Berroterán" },
      { punto: sitiosUNI["Edificio Carlos Santos Berroterán"], texto: "Has llegado al Edificio Carlos Santos Berroterán" }
    ],
    "Entrada IES|Edificio Rigoberto Lopez Perez": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 123 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Has llegado al Edificio Rigoberto Lopez Perez" }
    ],
    "Entrada IES|Biblioteca": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Has llegado a la Biblioteca" }
    ],
    "Entrada IES|Pabellon 1 IES": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 41 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada IES|Pabellon 2 IES": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 41 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada IES|Pabellon 3 IES": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 41 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 3 IES" },
      { punto: sitiosUNI["Pabellon 3 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada IES|Laboratorios IES": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 41 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 donde estan los Laboratorios IES" },
      { punto: sitiosUNI["Laboratorios IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada IES|Edificio Quimica": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 46 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 44 metros hasta el cafetin el deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Continúa 53 metros recto hasta el Cafetín El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Sigue 51 metros de frente hasta llegar al Cafetín El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Continúa 63 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Gira a la derecha y camina 31 metros hasta llegar al edificio de arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 33 metros hasta llegar al Edificio Quimica" },
      { punto: sitiosUNI["Edificio Quimica"], texto: "Has llegado a tu destino" }
    ],
    "Entrada IES|Laboratorios redes": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 46 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 44 metros hasta el cafetin el deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Continúa 53 metros recto hasta el Cafetín El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Sigue 51 metros de frente hasta llegar al Cafetín El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Continúa 63 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Gira a la derecha y camina 31 metros hasta llegar al edificio de arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 31 metros hasta llegar al Laboratorios redes" },
      { punto: sitiosUNI["Laboratorios redes"], texto: "Has llegado a tu destino" }
    ],
    "Entrada IES|Registro academico": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 46 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 44 metros hasta el cafetin el deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Continúa 53 metros recto hasta el Cafetín El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Sigue 51 metros de frente hasta llegar al Cafetín El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Continúa 63 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Has llegado a tu destino" },

    ],
    "Entrada IES|Edificio Posgrado": [
      { punto: sitiosUNI["Entrada IES"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 66 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Has llegado a tu destino" }
    ],
    "Entrada IES|Entrada IES": [
      { punto: sitiosUNI["Entrada IES"], texto: "Ya estas ubicado en la Entrada IES" }
    ],

    //ENTRADA TRASERA
    "Entrada Trasera|Edificio Rigoberto Lopez Perez": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Has llegado al Edificio Rigoberto Lopez Perez" }
    ],
    "Entrada Trasera|Edificio Albert Einstein": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Has llegado al Edificio Albert Einstein" }
    ],
    "Entrada Trasera|Auditorio Salomon de la Selva": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 10 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Trasera|Edificio Carlos Santos Berroterán": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 10 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Edificio Carlos Santos Berroterán"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Trasera|Pabellon 1 IES": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 10 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Trasera|Pabellon 2 IES": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 10 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Trasera|Pabellon 3 IES": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 10 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 3 IES" },
      { punto: sitiosUNI["Pabellon 3 IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Trasera|Laboratorios IES": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 10 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 donde estan los Laboratorios IES" },
      { punto: sitiosUNI["Laboratorios IES"], texto: "Has llegado a tu destino" }
    ],
    "Entrada Trasera|Biblioteca": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 41 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 10 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 67 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Has llegado a tu destino" }
    ],
     "Entrada Trasera|Edificio Posgrado": [
      { punto: sitiosUNI["Entrada Trasera"], texto: "Camina 137 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 67 metros hasta llegar al Edificio Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Has llegado a tu destino" }
    ],




    // Edificio Rigoberto Lopez Perez
    "Edificio Rigoberto Lopez Perez|Cafetin el chele": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 109 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 73 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 45 metros hasta llegar al Cafetin El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Has llegado a tu destino, Buen provecho" }
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin La Fritanga": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 109 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 73 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 45 metros hasta llegar al Cafetin El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 10 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Has llegado a tu destino, Buen provecho" }
    ],
    "Edificio Rigoberto Lopez Perez|Laboratorios redes": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 40 metros hasta llegar al Laboratorio de Redes" },
      { punto: sitiosUNI["Laboratorios redes"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Copias UNI": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 16 metros hasta llegar al Parqueo de Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 36 metros hasta llegar a Copias UNI" },
      { punto: sitiosUNI["Copias UNI"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Cajero": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 55 metros hasta llegar al Cajero" },
      { punto: sitiosUNI["Cajero"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin EL Gueguense": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 73 metros hasta llegar al Cafetin el Gueguense" },
      { punto: sitiosUNI["Cafetin EL Gueguense"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],
    "Edificio Rigoberto Lopez Perez|Batidos Miranda": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 90 metros hasta llegar al Cafetin Batidos Miranda" },
      { punto: sitiosUNI["Batidos Miranda"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin El Duarte": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin El Deportivo": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 109 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 73 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],
    "Edificio Rigoberto Lopez Perez|Cafetin El Comal": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 109 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 73 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 45 metros hasta llegar al Cafetin El Chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 10 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 25 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Has llegado a tu destino, Buen provecho" }
    ],
    "Edificio Rigoberto Lopez Perez|Biblioteca": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 109 metros hasta llegar a la biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Auditorio Salomon de la Selva": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 75 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Posgrado": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|La mita": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],
    "Edificio Rigoberto Lopez Perez|Pabellon 1 IES": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 43 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Pabellon 2 IES": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 43 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Pabellon 3 IES": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 43 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 3 IES" },
      { punto: sitiosUNI["Pabellon 3 IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Albert Einstein": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 43 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Laboratorios IES": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 43 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 donde estan los Laboratorios IES" },
      { punto: sitiosUNI["Laboratorios IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Autoservicio de impresiones": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 16 metros hasta llegar a la Entrada Principal" },
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 29 metros hasta llegar al Autoservicio de impresiones" },
      { punto: sitiosUNI["Autoservicio de impresiones"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Entrada Principal": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 16 metros hasta llegar a la Entrada Principal" },
      { punto: sitiosUNI["Entrada Principal"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Entrada IES": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 134 metros hasta llegar a la Entrada IES" },
      { punto: sitiosUNI["Entrada IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Entrada Trasera": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 72 metros hasta llegar al Parqueo edificio rigoberto" },
      { punto: sitiosUNI["Parqueo edificio rigoberto"], texto: "Camina 100 metros hasta llegar a la Entrada trasera" },
      { punto: sitiosUNI["Entrada Trasera"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Parqueo edificio rigoberto": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 72 metros hasta llegar al Parqueo edificio rigoberto" },
      { punto: sitiosUNI["Parqueo edificio rigoberto"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Parqueo Posgrado": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 16 metros hasta llegar al Parqueo de Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Registro academico": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Arquitectura": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 24 metros hasta llegar al Edificio de Arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Quimica": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 24 metros hasta llegar al Edificio de Arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 46 metros hasta llegar al Edificio Quimica" },
      { punto: sitiosUNI["Edificio Quimica"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Piscina": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 63 metros hasta llegar al Edificio de Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 26 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Carlos Santos Berroterán": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 75 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 30 metros hasta llegar al Edificio Carlos Santos Berroterán" },
      { punto: sitiosUNI["Edificio Carlos Santos Berroterán"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Rigoberto Lopez Perez|Edificio Rigoberto Lopez Perez": [
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Ya estas ubicado en el Edificio Rigoberto Lopez Perez" }
    ],


    //  EDIFICIO POSGRADO


    "Edificio Posgrado|Cafetin el chele": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 16 metros hasta llegar al Parqueo de Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 60 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Has llegado a tu destino" }
    ],


    "Edificio Posgrado|Cafetin La Fritanga": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 16 metros hasta llegar al Parqueo de Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 60 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 16 metros hasta llegar al Cafetin la Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Has llegado a tu destino, Buen provecho" }
    ],

    "Edificio Posgrado|Laboratorios redes": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 40 metros hasta llegar al Laboratorio de Redes" },
      { punto: sitiosUNI["Laboratorios redes"], texto: "Has llegado a tu destino" }
    ],



    "Edificio Posgrado|Copias UNI": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 16 metros hasta llegar al Parqueo de Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 36 metros hasta llegar a Copias UNI" },
      { punto: sitiosUNI["Copias UNI"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Cajero": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 55 metros hasta llegar al Cajero" },
      { punto: sitiosUNI["Cajero"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Cafetin EL Gueguense": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 100 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 32 metros hasta llegar al Cafetin Gueguense" },
      { punto: sitiosUNI["Cafetin EL Gueguense"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],

    "Edificio Posgrado|Batidos Miranda": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 100 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar a Batidos Miranda" },
      { punto: sitiosUNI["Batidos Miranda"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],

    "Edificio Posgrado|Cafetin El Duarte": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Has llegado a tu destino" }

    ],

    "Edificio Posgrado|Cafetin El Deportivo": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 90 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],

    "Edificio Posgrado|Cafetin El Comal": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 16 metros hasta llegar al Parqueo de Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 60 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 16 metros hasta llegar al Cafetin la Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 30 metros hasta llegar al Cafetin el Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Has llegado a tu destino, Buen provecho" }
    ],

    "Edificio Posgrado|Biblioteca": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 60 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Auditorio Salomon de la Selva": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 93 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Edificio Rigoberto Lopez Perez": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 42 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|La mita": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],

    "Edificio Posgrado|Pabellon 1 IES": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 100 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Pabellon 2 IES": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 100 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Pabellon 3 IES": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 100 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 3 IES" },
      { punto: sitiosUNI["Pabellon 3 IES"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Edificio Albert Einstein": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 100 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Laboratorios IES": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 100 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 34 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 donde estan los Laboratorios IES" },
      { punto: sitiosUNI["Laboratorios IES"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Autoservicio de impresiones": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 16 metros hasta llegar a la Entrada Principal" },
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 29 metros hasta llegar al Autoservicio de impresiones" },
      { punto: sitiosUNI["Autoservicio de impresiones"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Entrada Principal": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 16 metros hasta llegar a la Entrada Principal" },
      { punto: sitiosUNI["Entrada Principal"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Entrada IES": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 60 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 45 metros hasta llegar a la Entrada IES" },
      { punto: sitiosUNI["Entrada IES"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Entrada Trasera": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 70 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 72 metros hasta llegar al Parqueo edificio rigoberto" },
      { punto: sitiosUNI["Parqueo edificio rigoberto"], texto: "Camina 100 metros hasta llegar a la Entrada trasera" },
      { punto: sitiosUNI["Entrada Trasera"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Parqueo edificio rigoberto": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 70 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 72 metros hasta llegar al Parqueo edificio rigoberto" },
      { punto: sitiosUNI["Parqueo edificio rigoberto"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Parqueo Posgrado": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 16 metros hasta llegar al Parqueo de Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Registro academico": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Edificio Arquitectura": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 24 metros hasta llegar al Edificio de Arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Edificio Quimica": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 90 metros hasta llegar a Registro academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 24 metros hasta llegar al Edificio de Arquitectura" },
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 46 metros hasta llegar al Edificio Quimica" },
      { punto: sitiosUNI["Edificio Quimica"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Piscina": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 73 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 65 metros hasta llegar al Cafetin La Mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 26 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Edificio Carlos Santos Berroterán": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 93 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 30 metros hasta llegar al Edificio Carlos Santos Berroterán" },
      { punto: sitiosUNI["Edificio Carlos Santos Berroterán"], texto: "Has llegado a tu destino" }
    ],

    "Edificio Posgrado|Edificio Posgrado": [
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Ya estas ubicado en el Edificio de Posgrado" }
    ],


    // EDIFICIO DE ARQUITECTURA
    "Edificio Arquitectura|Piscina": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 16 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Entrada Principal": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 40 metros hasta llegar a la Entrada Principal" },
      { punto: sitiosUNI["Entrada Principal"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Registro academico": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Autoservicio de impresiones": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 40 metros hasta llegar a la Entrada Principal" },
      { punto: sitiosUNI["Entrada Principal"], texto: "Camina 32 metros hasta llegar al Autoservicio de impresiones" },
      { punto: sitiosUNI["Autoservicio de impresiones"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Edificio Quimica": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 33 metros hasta llegar al Edificio Quimica" },
      { punto: sitiosUNI["Edificio Quimica"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Laboratorios redes": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 31 metros hasta llegar al Laboratorios redes" },
      { punto: sitiosUNI["Laboratorios redes"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Cajero": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 47 metros hasta llegar al Cajero" },
      { punto: sitiosUNI["Cajero"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|La mita": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 16 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Camina 66 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Has llegado a tu destino, Buen provecho!" }
    ],
    "Edificio Arquitectura|Cafetin El Comal": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Cafetin La Fritanga": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Has llegado a tu destino, Provechito!" }
    ],
    "Edificio Arquitectura|Cafetin el chele": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Has llegado a tu destino, Provechito!" }
    ],
    "Edificio Arquitectura|Copias UNI": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 23 metros hasta llegar a Copias UNI" },
      { punto: sitiosUNI["Copias UNI"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Cafetin El Duarte": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 64 metros hasta llegar al Cafetin El Duarte" },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Has llegado a tu destino, Provechito!" }
    ],
    "Edificio Arquitectura|Parqueo Posgrado": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 16 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Camina 66 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 92 metros hasta llegar al Cafetin El Duarte " },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 23 metros hasta llegar al Parqueo Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Edificio Posgrado": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 16 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Camina 66 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 92 metros hasta llegar al Cafetin El Duarte " },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 23 metros hasta llegar al Parqueo Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 26 metros hasta llegar al Edificio Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Cafetin El Deportivo": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Has llegado a tu destino, Provechito!" }
    ],
    "Edificio Arquitectura|Biblioteca": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Entrada IES": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 37 metros hasta llegar a la Entrada IES" },
      { punto: sitiosUNI["Entrada IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Edificio Rigoberto Lopez Perez": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 16 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Camina 66 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 92 metros hasta llegar al Cafetin El Duarte " },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 23 metros hasta llegar al Parqueo Posgrado" },
      { punto: sitiosUNI["Parqueo Posgrado"], texto: "Camina 26 metros hasta llegar al Edificio Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 42 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Parqueo edificio rigoberto": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 16 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Camina 66 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 92 metros hasta llegar al Cafetin El Duarte " },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 23 metros hasta llegar al Parqueo Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 70 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 72 metros hasta llegar al Parqueo edificio rigoberto" },
      { punto: sitiosUNI["Parqueo edificio rigoberto"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Entrada Trasera": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 16 metros hasta llegar a la Piscina" },
      { punto: sitiosUNI["Piscina"], texto: "Camina 66 metros hasta llegar al Cafetin La mita" },
      { punto: sitiosUNI["La mita"], texto: "Camina 92 metros hasta llegar al Cafetin El Duarte " },
      { punto: sitiosUNI["Cafetin El Duarte"], texto: "Camina 23 metros hasta llegar al Parqueo Posgrado" },
      { punto: sitiosUNI["Edificio Posgrado"], texto: "Camina 70 metros hasta llegar al Edificio Rigoberto Lopez Perez" },
      { punto: sitiosUNI["Edificio Rigoberto Lopez Perez"], texto: "Camina 72 metros hasta llegar al Parqueo edificio rigoberto" },
      { punto: sitiosUNI["Parqueo edificio rigoberto"], texto: "Camina 100 metros hasta llegar a la Entrada trasera" },
      { punto: sitiosUNI["Entrada Trasera"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Edificio Carlos Santos Berroterán": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 63 metros hasta llegar al Edificio Carlos Santos Berroterán" },
      { punto: sitiosUNI["Edificio Carlos Santos Berroterán"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Auditorio Salomon de la Selva": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Edificio Albert Einstein": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 33 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Batidos Miranda": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 33 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 43 metros hasta llegar a Batidos Miranda" },
      { punto: sitiosUNI["Batidos Miranda"], texto: "Has llegado a tu destino!" }
    ],
    "Edificio Arquitectura|Cafetin EL Gueguense": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 33 metros hasta llegar al Edificio Albert Einstein" },
      { punto: sitiosUNI["Edificio Albert Einstein"], texto: "Camina 38 metros hasta llegar al Cafetin EL Gueguense" },
      { punto: sitiosUNI["Cafetin EL Gueguense"], texto: "Has llegado a tu destino!" }
    ],
    "Edificio Arquitectura|Pabellon 1 IES": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Pabellon 2 IES": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Pabellon 3 IES": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 IES" },
      { punto: sitiosUNI["Pabellon 2 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 3 IES" },
      { punto: sitiosUNI["Pabellon 3 IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Laboratorios IES": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Camina 22 metros hasta llegar a Registro Academico" },
      { punto: sitiosUNI["Registro academico"], texto: "Camina 60 metros hasta llegar al Cafetin El Comal" },
      { punto: sitiosUNI["Cafetin El Comal"], texto: "Camina 58 metros hasta llegar al Cafetin La Fritanga" },
      { punto: sitiosUNI["Cafetin La Fritanga"], texto: "Camina 21 metros hasta llegar al Cafetin el chele" },
      { punto: sitiosUNI["Cafetin el chele"], texto: "Camina 65 metros hasta llegar al Cafetin El Deportivo" },
      { punto: sitiosUNI["Cafetin El Deportivo"], texto: "Camina 35 metros hasta llegar a la Biblioteca" },
      { punto: sitiosUNI["Biblioteca"], texto: "Camina 67 metros hasta llegar al Auditorio Salomon de la Selva" },
      { punto: sitiosUNI["Auditorio Salomon de la Selva"], texto: "Camina 21 metros hasta llegar al Pabellon 1 IES" },
      { punto: sitiosUNI["Pabellon 1 IES"], texto: "Camina 25 metros hasta llegar al Pabellon 2 donde estan los Laboratorios IES" },
      { punto: sitiosUNI["Laboratorios IES"], texto: "Has llegado a tu destino" }
    ],
    "Edificio Arquitectura|Edificio Arquitectura": [
      { punto: sitiosUNI["Edificio Arquitectura"], texto: "Ya estas ubicado en el Edificio de Arquitectura" }
    ],





  };

  function dibujarRutaPersonalizada(origenNombre, destinoNombre) {
    const clave = `${origenNombre}|${destinoNombre}`;
    const ruta = rutasUNI[clave];
    if (!ruta) {
      Swal.fire("Ruta no disponible", "Todavía no se ha programado esa ruta.", "info");
      return;
    }
    if (lineaRuta) {
      mapa.removeLayer(lineaRuta);
    }
    lineaRuta = L.polyline(ruta, {
      color: "#00c8f5",
      weight: 8,
      opacity: 0.9
    }).addTo(mapa);
    mapa.fitBounds(lineaRuta.getBounds());
    if (instruccionesUNI[clave]) {
      rutaActiva = instruccionesUNI[clave];
      pasoActual = 0;
      actualizarPanelRuta(rutaActiva[0].texto, mapa.distance(userLocation || rutaActiva[0].punto, rutaActiva[0].punto));
      hablar("Ruta iniciada. " + rutaActiva[0].texto);
    }
  }

  function actualizarPanelRuta(texto, distancia) {
    const panel = document.getElementById("panelNavegacion");
    const txt = document.getElementById("textoInstruccion");
    const metros = document.getElementById("metrosRestantes");
    if (!panel) return;
    panel.style.display = "block";
    txt.textContent = texto;
    if (distancia !== undefined) {
      metros.textContent = distancia < 1000 ? `${Math.round(distancia)} m` : `${(distancia / 1000).toFixed(1)} km`;
    }
  }

  let userLocation = null;

  function hablar(texto) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let msj = new SpeechSynthesisUtterance(texto);
      msj.lang = 'es-ES';
      window.speechSynthesis.speak(msj);
    }
  }

  function verificarPasoRuta() {
    if (!rutaActiva || !userLocation) return;
    if (pasoActual >= rutaActiva.length) return;
    const puntoObjetivo = rutaActiva[pasoActual].punto;
    const distancia = mapa.distance(userLocation, puntoObjetivo);
    actualizarPanelRuta(rutaActiva[pasoActual].texto, distancia);
    if (distancia <= 10) {
      pasoActual++;
      if (pasoActual < rutaActiva.length) {
        actualizarPanelRuta(rutaActiva[pasoActual].texto, mapa.distance(userLocation, rutaActiva[pasoActual].punto));
        hablar(rutaActiva[pasoActual].texto);
      } else {
        actualizarPanelRuta("Has llegado a tu destino", 0);
        hablar("Has llegado a tu destino");
        rutaActiva = null;
      }
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
      option.value = nombre;
      option.text = nombre;
      if (select) select.appendChild(option);
      if (sitiosUNI[nombre][0] !== 0) {
        L.marker(sitiosUNI[nombre]).bindPopup(`<strong style="color:#001f3f;">${nombre}</strong>`).addTo(mapa);
      }
    }

    const btnCentrar = document.getElementById('btnCentrar');
    if (btnCentrar) {
      btnCentrar.onclick = () => { if (userLocation) mapa.setView(userLocation, 19); };
    }

    const btnActivarGPS = document.getElementById('btnActivarGPS');
    if (btnActivarGPS) {
      btnActivarGPS.onclick = function () {
        let utterance = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(utterance);
        if (!navigator.geolocation) return Swal.fire("Error", "GPS no soportado.", "error");

        Swal.fire({ title: 'Buscando tu ubicación...', didOpen: () => { Swal.showLoading(); } });

        navigator.geolocation.watchPosition(
          (pos) => {
            Swal.close();
            userLocation = [pos.coords.latitude, pos.coords.longitude];
            verificarPasoRuta();
            const statusGPS = document.getElementById('statusGPS');
            if (statusGPS) statusGPS.innerHTML = `<span style="color: #28a745; font-weight: bold;"><i class="fa-solid fa-location-dot"></i> GPS Conectado.</span>`;
            if (btnCentrar) btnCentrar.style.display = 'inline-flex';

            if (!userMarker) {
              markerPulse = L.marker(userLocation, { icon: L.divIcon({ className: 'gps-pulse', iconSize: [40, 40], iconAnchor: [20, 20] }) }).addTo(mapa);
              userMarker = L.marker(userLocation, { icon: L.divIcon({ className: 'user-icon', html: '<div style="background: #00c8f5; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white;"></div>' }) }).addTo(mapa).bindPopup("Tú");
              mapa.setView(userLocation, 18);
              hablar("GPS conectado.");
            } else {
              userMarker.setLatLng(userLocation);
              markerPulse.setLatLng(userLocation);
            }
          },
          (err) => { Swal.fire("Enciende tu ubicación", "Permite el acceso al GPS.", "warning"); },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      };
    }

    const btnIr = document.getElementById('btnIr');
    if (btnIr) {
      btnIr.onclick = function () {
        const origenNombre = document.getElementById('origen').value;
        const destinoNombre = document.getElementById('destino').value;

        if (!destinoNombre) {
          return Swal.fire("Atención", "Selecciona un destino.", "info");
        }

        if (origenNombre === "gps") {
          Swal.fire({
            title: 'Activando GPS...',
            text: 'Obteniendo ubicación actual.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
          });
          navigator.geolocation.getCurrentPosition(
            function (pos) {
              Swal.close();
              userLocation = [pos.coords.latitude, pos.coords.longitude];
              if (!userMarker) {
                userMarker = L.marker(userLocation).addTo(mapa).bindPopup("Tu ubicación");
              } else {
                userMarker.setLatLng(userLocation);
              }

              mapa.setView(userLocation, 18);

              let origenDetectado = "Entrada Principal";
              const distanciaEntradaPrincipal = mapa.distance(userLocation, sitiosUNI["Entrada Principal"]);
              const distanciaEntradaIES = mapa.distance(userLocation, sitiosUNI["Entrada IES"]);
              if (distanciaEntradaIES < distanciaEntradaPrincipal) {
                origenDetectado = "Entrada IES";
              }
              dibujarRutaPersonalizada(origenDetectado, destinoNombre);
            },
            function () {
              Swal.fire("GPS no disponible", "No se pudo obtener tu ubicación.", "error");
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        } else {
          dibujarRutaPersonalizada(origenNombre, destinoNombre);
        }
      };
    }
  }
});

// -------------------------------------------------------------
// FUNCIONES DE MODALES Y LÓGICA DE AULAS DINÁMICA
// -------------------------------------------------------------
window.abrirSimulacion = async function (lugar, mediaUrl = '', tipoMedia = 'imagen', itemId = '') {
  const modal = document.getElementById('videoModal');
  const title = document.getElementById('modalTitle');
  if (title) title.innerText = 'Ruta hacia: ' + lugar;

  const videoContainer = modal.querySelector('.video-container');
  if (videoContainer) {
    if (mediaUrl) {
      if (tipoMedia === 'imagen') {
        videoContainer.innerHTML = `<img src="${mediaUrl}" alt="${lugar}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
      } else {
        videoContainer.innerHTML = `<video src="${mediaUrl}" controls style="width: 100%; height: 100%; border-radius: inherit;"></video>`;
      }
    } else {
      videoContainer.innerHTML = `<p><span class="material-icons" style="font-size: 48px; color: var(--accent-color);">play_circle</span><br>Recorrido no disponible</p>`;
    }
  }

  const listaIndicaciones = document.getElementById("lista-indicaciones");
  if (listaIndicaciones) {
    listaIndicaciones.innerHTML = "<li>Cargando indicaciones...</li>";

    try {
      if (!indicacionesData) {
        const res = await fetch('Json/indicaciones.json');
        indicacionesData = await res.json();
      }

      let idBuscado = itemId;
      if (!idBuscado && datosCompletos) {
        for (let cat in datosCompletos.categorias) {
          let encontrado = datosCompletos.categorias[cat].find(i => i.nombre === lugar);
          if (encontrado) { idBuscado = encontrado.id; break; }
        }
      }

      let pasos = indicacionesData[idBuscado];
      if (!pasos || pasos.length === 0) {
        pasos = ["Dirígete a tu destino siguiendo las indicaciones del mapa principal."];
      }

      listaIndicaciones.innerHTML = "";
      pasos.forEach(paso => {
        let li = document.createElement("li");
        li.textContent = paso;
        listaIndicaciones.appendChild(li);
      });

    } catch (error) {
      listaIndicaciones.innerHTML = "<li>Sigue la ruta marcada en el mapa.</li>";
    }
  }

  if (modal) modal.classList.add('active');
}

window.cerrarSimulacion = function () {
  const modal = document.getElementById('videoModal');
  if (modal) {
    modal.classList.remove('active');
    const video = modal.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    const videoContainer = modal.querySelector('.video-container');
    if (videoContainer) videoContainer.innerHTML = '';
  }
}

window.abrirModalPisos = function (edificioId) {
  edificioActualId = edificioId || "rigoberto";
  const modal = document.getElementById('modalPisos');

  if (modal) modal.classList.add('active');
  window.cambiarPestanaRigoberto('info');

  const imgEdificio = document.getElementById('img-info-edificio');
  if (imgEdificio && datosCompletos) {
    const edificioData = datosCompletos.categorias.principales.find(e => e.id === edificioActualId);
    if (edificioData) {
      imgEdificio.src = edificioData.img;
    }
  }

  if (datosCompletos && datosCompletos.detallesEdificios && datosCompletos.detallesEdificios[edificioActualId]) {
    const pisosData = datosCompletos.detallesEdificios[edificioActualId].pisos;
    const trackPisos = document.getElementById('track-pisos');
    if (trackPisos) {
      trackPisos.innerHTML = "";
      pisosData.forEach(piso => {
        let btn = document.createElement('button');
        btn.className = 'piso-btn';
        btn.innerText = piso.label.toUpperCase();
        btn.onclick = function () { window.seleccionarPiso(piso.id, piso.label, this); };
        trackPisos.appendChild(btn);
      });
    }
  }
}

window.cerrarModalPisos = function () {
  const modal = document.getElementById('modalPisos');
  if (modal) modal.classList.remove('active');
  const opcionesAula = document.getElementById('opciones-aula');
  if (opcionesAula) opcionesAula.style.display = 'none';
  document.querySelectorAll('.piso-btn').forEach(b => b.classList.remove('activo'));
  const trackPisos = document.getElementById('track-pisos');
  if (trackPisos) trackPisos.scrollTo({ left: 0 });
}

window.cambiarPestanaRigoberto = function (pestana) {
  const btnInfo = document.getElementById('btn-tab-info');
  const btnAulas = document.getElementById('btn-tab-aulas');
  const contenidoInfo = document.getElementById('contenido-info-rigoberto');
  const contenidoAulas = document.getElementById('contenido-aulas-rigoberto');

  if (pestana === 'info') {
    if (contenidoInfo) contenidoInfo.style.display = 'block';
    if (contenidoAulas) contenidoAulas.style.display = 'none';
    if (btnInfo) { btnInfo.style.background = 'var(--primary-color)'; btnInfo.style.color = 'white'; }
    if (btnAulas) { btnAulas.style.background = '#e0e0e0'; btnAulas.style.color = 'var(--text-gray)'; }
  } else {
    if (contenidoInfo) contenidoInfo.style.display = 'none';
    if (contenidoAulas) contenidoAulas.style.display = 'block';
    if (btnAulas) { btnAulas.style.background = 'var(--primary-color)'; btnAulas.style.color = 'white'; }
    if (btnInfo) { btnInfo.style.background = '#e0e0e0'; btnInfo.style.color = 'var(--text-gray)'; }
  }
}

window.desplazarCarruselPisos = function (cantidad) {
  const track = document.getElementById('track-pisos');
  if (track) track.scrollBy({ left: cantidad, behavior: 'smooth' });
}

window.seleccionarPiso = function (pisoId, pisoLabel, botonHtml) {
  document.querySelectorAll('.piso-btn').forEach(b => b.classList.remove('activo'));
  if (botonHtml) botonHtml.classList.add('activo');

  const opcionesAula = document.getElementById('opciones-aula');
  if (opcionesAula) opcionesAula.style.display = 'block';

  const inputPiso = document.getElementById('input-piso-actual');
  if (inputPiso) inputPiso.value = pisoLabel;

  const contenedorTarjetas = document.getElementById('contenedor-tarjetas-aula');
  if (!contenedorTarjetas) return;

  contenedorTarjetas.innerHTML = "";

  if (datosCompletos && datosCompletos.detallesEdificios[edificioActualId] && datosCompletos.detallesEdificios[edificioActualId].aulas[pisoId]) {
    const selectLado = document.getElementById('select-lado-aula');
    const ladoActual = selectLado ? selectLado.value : 'A';

    const aulasDelPiso = datosCompletos.detallesEdificios[edificioActualId].aulas[pisoId][ladoActual] || [];

    if (aulasDelPiso.length === 0) {
      contenedorTarjetas.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">No hay aulas registradas en el Lado ${ladoActual} de este piso.</p>`;
      return;
    }

    aulasDelPiso.forEach(aula => {
      contenedorTarjetas.innerHTML += `
        <div class="tarjeta-aula-modal">
          <h4>${aula.nombre}</h4>
          <button onclick="window.abrirModalAulaVirtual('${aula.nombre}', '${aula.media || ''}', '${aula.tipoMedia || 'imagen'}')">
            <span class="material-icons">image</span> Ver Imagen
          </button>
        </div>
      `;
    });
  } else {
    contenedorTarjetas.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">Datos no disponibles para este piso aún.</p>`;
  }
}

document.addEventListener('change', function (e) {
  if (e.target && e.target.id === 'select-lado-aula') {
    const btnActivo = document.querySelector('.piso-btn.activo');
    if (btnActivo) {
      btnActivo.click();
    }
  }
});

window.abrirModalAulaVirtual = function (aula, mediaUrl = '', tipoMedia = 'imagen') {
  const titulo = document.getElementById('titulo-aula-virtual');
  if (titulo) titulo.innerText = 'Destino: ' + aula;

  const modal = document.getElementById('modalAulaVirtual');
  const videoContainer = modal.querySelector('.video-container');
  if (videoContainer) {
    if (mediaUrl) {
      if (tipoMedia === 'video') {
        videoContainer.innerHTML = `<video src="${mediaUrl}" controls style="width: 100%; height: 100%; border-radius: inherit;"></video>`;
      } else {
        videoContainer.innerHTML = `<img src="${mediaUrl}" alt="${aula}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
      }
    } else {
      videoContainer.innerHTML = `<p style="text-align: center;"><span class="material-icons" style="font-size: 60px; color: var(--accent-color);">play_circle</span><br><br>Reproductor de Recorrido no disponible</p>`;
    }
  }

  window.cerrarModalPisos();
  if (modal) modal.classList.add('active');
}

window.cerrarModalAulaVirtual = function () {
  const modal = document.getElementById('modalAulaVirtual');
  if (modal) {
    modal.classList.remove('active');
    const video = modal.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    const videoContainer = modal.querySelector('.video-container');
    if (videoContainer) videoContainer.innerHTML = '';
  }
}

document.addEventListener('click', function (e) {
  const mVideo = document.getElementById('videoModal');
  const mPisos = document.getElementById('modalPisos');
  const mAula = document.getElementById('modalAulaVirtual');
  if (e.target === mVideo) window.cerrarSimulacion();
  if (e.target === mPisos) window.cerrarModalPisos();
  if (e.target === mAula) window.cerrarModalAulaVirtual();
});

// -------------------------------------------------------------
// CARGA DE DESTINO DESDE INDEX (LOCALSTORAGE)
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // 1. Caso de búsqueda usando objetos completos (ej: buscarDestino())
  const destinoGuardado = localStorage.getItem("destinoBuscado");
  if (destinoGuardado) {
    try {
      const destino = JSON.parse(destinoGuardado);
      setTimeout(() => {
        const selectDestino = document.getElementById("destino");
        const btnIr = document.getElementById("btnIr");
        if (selectDestino && btnIr) {
          let optionExists = Array.from(selectDestino.options).some(opt => opt.value === destino.nombre);
          if (!optionExists) {
            let opt = document.createElement('option');
            opt.value = destino.nombre;
            opt.text = destino.nombre;
            selectDestino.appendChild(opt);
          }

          selectDestino.value = destino.nombre;
          btnIr.click();
          document.getElementById("navegacion-asistida").scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 800); // Dar un poco de tiempo para asegurar que el mapa y los selects de Leaflet se construyeron
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("destinoBuscado");
  }

  // 2. Caso de búsqueda usando el string simple (ej: barra superior)
  const destinoSimple = localStorage.getItem("destinoBuscadoSimple");
  if (destinoSimple) {
    setTimeout(() => {
      const selectDestino = document.getElementById("destino");
      const btnIr = document.getElementById("btnIr");
      if (selectDestino && btnIr) {
        let optionExists = Array.from(selectDestino.options).some(opt => opt.value === destinoSimple);
        if (!optionExists) {
          let opt = document.createElement('option');
          opt.value = destinoSimple;
          opt.text = destinoSimple;
          selectDestino.appendChild(opt);
        }

        selectDestino.value = destinoSimple;
        btnIr.click();
        document.getElementById("navegacion-asistida").scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 800);
    localStorage.removeItem("destinoBuscadoSimple");
  }
});