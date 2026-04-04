
  function cambiarVista(idVista) {
    document.querySelectorAll('.vista').forEach(vista => {
      vista.classList.remove('activa');
    });
    
    document.getElementById(idVista).classList.add('activa');
    window.scrollTo(0, 0); 

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('activo');
    });
    if(event && event.currentTarget && event.currentTarget.classList) {
       event.currentTarget.classList.add('activo');
    }

    const navMovil = document.querySelector('nav.main-nav');
    if(navMovil && navMovil.classList.contains('active')) {
      navMovil.classList.remove('active');
    }

    if (idVista === 'vista-destinos') {
      document.querySelectorAll('.contenedor-slider').forEach(contenedor => {
        const sliderTrack = contenedor.querySelector('.carousel-track');
        if (sliderTrack) {
          sliderTrack.dispatchEvent(new Event('scroll'));
        }
      });
    }
  }

  function toggleMenuMovil() {
    document.querySelector('nav.main-nav').classList.toggle('active');
  }

  document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.anim-element').forEach((el) => {
      observer.observe(el);
    });

    document.querySelectorAll('.contenedor-slider').forEach(contenedor => {
      const sliderTrack = contenedor.querySelector('.carousel-track');
      const botonAnterior = contenedor.querySelector('.boton-slider.anterior');
      const botonSiguiente = contenedor.querySelector('.boton-slider.siguiente');

      if (sliderTrack && botonAnterior && botonSiguiente) {
        let cantidadDesplazamiento = 0;
        const anchoSlide = 320; 

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
          e.preventDefault();
          sliderTrack.scrollLeft += e.deltaY;
          cantidadDesplazamiento = sliderTrack.scrollLeft;
          actualizarVisibilidadBotones();
        });

        sliderTrack.addEventListener('scroll', () => {
          cantidadDesplazamiento = sliderTrack.scrollLeft;
          actualizarVisibilidadBotones();
        });

        actualizarVisibilidadBotones();
      }
    });
  });

  function toggleSidebar() {
    const sidebar = document.getElementById('formSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }

  function toggleSearchModal() {
    const modal = document.getElementById('searchModal');
    const overlay = document.getElementById('searchOverlay');
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
  }

  function abrirSimulacion(lugar) {
    const modal = document.getElementById('videoModal');
    const title = document.getElementById('modalTitle');
    title.innerText = 'Ruta hacia: ' + lugar;
    modal.classList.add('active');
  }

  function cerrarSimulacion() {
    const modal = document.getElementById('videoModal');
    modal.classList.remove('active');
  }
  
  function abrirModalPisos() {
    document.getElementById('modalPisos').classList.add('active');
    cambiarPestanaRigoberto('info'); 
  }

  function cerrarModalPisos() {
    document.getElementById('modalPisos').classList.remove('active');
    document.getElementById('opciones-aula').style.display = 'none';
    document.querySelectorAll('.piso-btn').forEach(b => b.classList.remove('activo'));
    document.getElementById('track-pisos').scrollTo({ left: 0 });
  }

  function cambiarPestanaRigoberto(pestana) {
    const btnInfo = document.getElementById('btn-tab-info');
    const btnAulas = document.getElementById('btn-tab-aulas');
    const contenidoInfo = document.getElementById('contenido-info-rigoberto');
    const contenidoAulas = document.getElementById('contenido-aulas-rigoberto');

    if(pestana === 'info') {
      contenidoInfo.style.display = 'block';
      contenidoAulas.style.display = 'none';
      btnInfo.style.background = 'var(--primary-color)';
      btnInfo.style.color = 'white';
      btnAulas.style.background = '#e0e0e0';
      btnAulas.style.color = 'var(--text-gray)';
    } else {
      contenidoInfo.style.display = 'none';
      contenidoAulas.style.display = 'block';
      btnAulas.style.background = 'var(--primary-color)';
      btnAulas.style.color = 'white';
      btnInfo.style.background = '#e0e0e0';
      btnInfo.style.color = 'var(--text-gray)';
    }
  }

  function desplazarCarruselPisos(cantidad) {
    const track = document.getElementById('track-pisos');
    track.scrollBy({ left: cantidad, behavior: 'smooth' });
  }

  function seleccionarPiso(piso, botonHtml) {
    document.getElementById('input-piso-actual').value = piso;
    document.getElementById('opciones-aula').style.display = 'block';
    document.querySelectorAll('.piso-btn').forEach(b => b.classList.remove('activo'));
    botonHtml.classList.add('activo');
  }

  function abrirModalAulaVirtual(aula) {
    document.getElementById('titulo-aula-virtual').innerText = 'Destino: ' + aula;
    cerrarModalPisos();
    document.getElementById('modalAulaVirtual').classList.add('active');
  }

  function cerrarModalAulaVirtual() {
    document.getElementById('modalAulaVirtual').classList.remove('active');
  }
  
  function abrirModalGPS() {
    document.getElementById('modalGPS').classList.add('active');
  }

  function cerrarGPS() {
    document.getElementById('modalGPS').classList.remove('active');
  }

  function abrirModalSmart(tipo) {
    const titulo = document.getElementById('smartTitle');
    const cuerpo = document.getElementById('smartBody');
    
    if(tipo === 'primer-dia') {
      titulo.innerText = "¡Modo Primer Día!";
      cuerpo.innerHTML = `
        <div style="text-align: left;">
          <p style="margin-bottom: 20px; color: var(--text-gray); font-size: 16px;">¡No te preocupes! Te guiaremos paso a paso para que domines tu primer día en el campus:</p>
          <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
            <div style="display: flex; align-items: center; gap: 15px; background: var(--bg-light); padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary-color);">
              <span class="material-icons" style="color: var(--primary-color); font-size: 28px;">login</span>
              <div><h4 style="margin:0; font-size: 16px;">Paso 1: Entrada Principal</h4><p style="margin: 5px 0 0; font-size: 13px; color: var(--text-gray);">Ingreso y control de carnet.</p></div>
            </div>
            <div style="display: flex; align-items: center; gap: 15px; background: var(--bg-light); padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary-color);">
              <span class="material-icons" style="color: var(--primary-color); font-size: 28px;">badge</span>
              <div><h4 style="margin:0; font-size: 16px;">Paso 2: Secretaría Académica</h4><p style="margin: 5px 0 0; font-size: 13px; color: var(--text-gray);">Confirmación de horarios.</p></div>
            </div>
            <div style="display: flex; align-items: center; gap: 15px; background: var(--bg-light); padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary-color);">
              <span class="material-icons" style="color: var(--primary-color); font-size: 28px;">class</span>
              <div><h4 style="margin:0; font-size: 16px;">Paso 3: Tu primera aula</h4><p style="margin: 5px 0 0; font-size: 13px; color: var(--text-gray);">Llegarás 10 minutos antes.</p></div>
            </div>
          </div>
          <button class="btn-select" style="width: 100%; font-size: 16px; padding: 15px;" onclick="cerrarModalSmart(); abrirModalGPS();">Iniciar Ruta Automática</button>
        </div>
      `;
    } else if(tipo === 'donde-estoy') {
      titulo.innerText = "Localización Activa";
      cuerpo.innerHTML = `
        <div style="text-align: center;">
          <span class="material-icons" style="font-size: 60px; color: var(--accent-color);">gps_fixed</span>
          <h3 style="margin: 20px 0 10px; color: var(--primary-color);">Estás cerca de: Pabellón IES</h3>
          <p style="color: var(--text-gray); margin-bottom: 25px;">Hemos detectado tu ubicación aproximada. ¿Hacia dónde vamos ahora?</p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button class="btn-select" style="background: var(--white); border: 2px solid var(--border-color); color: var(--text-dark);" onclick="cerrarModalSmart(); abrirSimulacion('Salida Principal')">Ir a la salida principal</button>
            <button class="btn-select" style="background: var(--white); border: 2px solid var(--border-color); color: var(--text-dark);" onclick="cerrarModalSmart(); abrirModalPisos()">Ir al Edificio Rigoberto</button>
          </div>
        </div>
      `;
    } else if(tipo === 'hambre') {
       titulo.innerText = "¡Hora de comer!";
       cuerpo.innerHTML = `
         <div style="text-align: center;">
           <span class="material-icons" style="font-size: 60px; color: #e74c3c;">fastfood</span>
           <p style="color: var(--text-gray); margin: 20px 0;">Aquí tienes todas las opciones disponibles en el campus:</p>
           <div style="display: flex; flex-direction: column; gap: 10px;">
              <button class="btn-select" style="background: var(--primary-color);" onclick="cerrarModalSmart(); abrirSimulacion('Cafetería El Chele')">Cafetería "El Chele"</button>
              <button class="btn-select" style="background: var(--primary-color);" onclick="cerrarModalSmart(); abrirSimulacion('Cafetería El Güegüense')">Cafetería "El Güegüense"</button>
              <button class="btn-select" style="background: var(--primary-color);" onclick="cerrarModalSmart(); abrirSimulacion('Cafetería El Duarte')">Cafetería "El Duarte"</button>
              <button class="btn-select" style="background: var(--primary-color);" onclick="cerrarModalSmart(); abrirSimulacion('Cafetería La Fritanga')">Cafetería "La Fritanga"</button>
           </div>
         </div>
       `;
    } else if(tipo === 'tarde') {
       titulo.innerText = "¡Voy tarde!";
       cuerpo.innerHTML = `
         <div style="text-align: center;">
           <span class="material-icons" style="font-size: 60px; color: #f39c12;">directions_run</span>
           <p style="color: var(--text-gray); margin: 20px 0;">Activando modo de ruta ultrarrápida. Evitaremos pasillos concurridos y escaleras principales para que llegues a tiempo.</p>
           <button class="btn-select" style="background: #e74c3c;" onclick="cerrarModalSmart(); abrirModalGPS();">Generar Atajo Ahora</button>
         </div>
       `;
    } else if(tipo === 'imprimir') {
       titulo.innerText = "Centros de Copiado";
       cuerpo.innerHTML = `
         <div style="text-align: center;">
           <span class="material-icons" style="font-size: 60px; color: #3498db;">print</span>
           <p style="color: var(--text-gray); margin: 20px 0;">Selecciona el centro de copiado al que deseas ir:</p>
           <div style="display: flex; flex-direction: column; gap: 10px;">
             <button class="btn-select" onclick="cerrarModalSmart(); abrirSimulacion('RapiCopias Castellón')">RapiCopias Castellón</button>
             <button class="btn-select" onclick="cerrarModalSmart(); abrirSimulacion('Quiosco IES')">Quiosco IES</button>
             <button class="btn-select" onclick="cerrarModalSmart(); abrirSimulacion('Fotocopiadora Central')">Fotocopiadora Central</button>
           </div>
         </div>
       `;
    } else if(tipo === 'planner') {
       const p1 = document.getElementById('plan1').value || "Destino 1";
       const p2 = document.getElementById('plan2').value || "Destino 2";
       const p3 = document.getElementById('plan3').value || "Destino 3";
       
       titulo.innerText = "Ruta Optimizada";
       cuerpo.innerHTML = `
         <div style="text-align: left;">
           <p style="color: var(--text-gray); margin-bottom: 20px;">Hemos organizado tu día para caminar lo menos posible. Esta es tu ruta:</p>
           <div style="background: var(--bg-light); border-radius: 10px; padding: 20px; border: 1px solid var(--border-color);">
              <p style="margin-bottom: 10px; font-weight: bold; color: var(--primary-color);">1. Inicio → <span style="color: var(--text-dark);">${p1}</span></p>
              <p style="margin-bottom: 10px; font-weight: bold; color: var(--primary-color);">2. Siguiente → <span style="color: var(--text-dark);">${p2}</span></p>
              <p style="font-weight: bold; color: var(--primary-color);">3. Final → <span style="color: var(--text-dark);">${p3}</span></p>
           </div>
           <div style="margin-top: 20px; display: flex; justify-content: space-between; color: var(--text-gray); font-size: 14px;">
              <span>Tiempo total est.: <strong>15 min</strong></span>
              <span>Distancia: <strong>850m</strong></span>
           </div>
           <button class="btn-select" style="margin-top: 25px; width: 100%;" onclick="cerrarModalSmart(); abrirModalGPS();">Comenzar Primer Tramo</button>
         </div>
       `;
    }

    else if(tipo === 'fav-chele') {
       titulo.innerText = "Comedor El Chele";
       cuerpo.innerHTML = `
         <div style="text-align: center;">
           <span class="material-icons" style="font-size: 60px; color: var(--primary-color);">fastfood</span>
           <h3 style="color: var(--primary-color); margin: 15px 0;">¿Por qué lo recomendamos?</h3>
           <p style="color: var(--text-gray); line-height: 1.6; text-align: justify; margin-bottom: 20px;">
             Seleccionamos este lugar por ofrecer la <strong>mejor relación calidad-precio</strong> en todo el campus. Sus porciones son generosas, el menú es variado todos los días y es el salvavidas oficial de los estudiantes a fin de mes. ¡No te pierdas su especialidad los viernes!
           </p>
           <button class="btn-select" onclick="cerrarModalSmart(); abrirSimulacion('Comedor El Chele')">Ver Ruta</button>
         </div>
       `;
    } else if(tipo === 'fav-copias') {
       titulo.innerText = "RapiCopias Castellón";
       cuerpo.innerHTML = `
         <div style="text-align: center;">
           <span class="material-icons" style="font-size: 60px; color: var(--accent-color);">print</span>
           <h3 style="color: var(--primary-color); margin: 15px 0;">¿Por qué lo recomendamos?</h3>
           <p style="color: var(--text-gray); line-height: 1.6; text-align: justify; margin-bottom: 20px;">
             Elegido por tener los <strong>precios más accesibles</strong> en impresiones y copias. Además, el servicio es rápido, entienden exactamente los formatos que piden los profesores y siempre te sacan de apuros cuando necesitas imprimir tu proyecto 5 minutos antes de la clase.
           </p>
           <button class="btn-select" onclick="cerrarModalSmart(); abrirSimulacion('RapiCopias Castellón')">Ver Ruta</button>
         </div>
       `;
    } else if(tipo === 'fav-biblioteca') {
       titulo.innerText = "Biblioteca Central";
       cuerpo.innerHTML = `
         <div style="text-align: center;">
           <span class="material-icons" style="font-size: 60px; color: #2980b9;">menu_book</span>
           <h3 style="color: var(--primary-color); margin: 15px 0;">¿Por qué lo recomendamos?</h3>
           <p style="color: var(--text-gray); line-height: 1.6; text-align: justify; margin-bottom: 20px;">
             El santuario definitivo para el estudio. Lo elegimos por ser <strong>el lugar más silencioso y con mejor clima</strong> del campus. Cuenta con cubículos privados, enchufes para tu laptop, conexión Wi-Fi estable y un acervo bibliográfico enorme para tus investigaciones.
           </p>
           <button class="btn-select" onclick="cerrarModalSmart(); abrirSimulacion('Biblioteca Central')">Ver Ruta</button>
         </div>
       `;
    } else if(tipo === 'fav-cajero') {
       titulo.innerText = "Cajero Automático";
       cuerpo.innerHTML = `
         <div style="text-align: center;">
           <span class="material-icons" style="font-size: 60px; color: #7f8c8d;">local_atm</span>
           <h3 style="color: var(--primary-color); margin: 15px 0;">¿Por qué lo recomendamos?</h3>
           <p style="color: var(--text-gray); line-height: 1.6; text-align: justify; margin-bottom: 20px;">
             Un punto estratégico vital. Lo recomendamos porque <strong>siempre es necesario tener efectivo para emergencias</strong>, copias de última hora o comprar un snack en los quioscos que no aceptan tarjeta. Es un lugar seguro, céntrico y siempre disponible.
           </p>
           <button class="btn-select" onclick="cerrarModalSmart(); abrirSimulacion('Cajero Automático')">Ver Ruta</button>
         </div>
       `;
    }
    
    document.getElementById('modalSmart').classList.add('active');
  }

  function cerrarModalSmart() {
    document.getElementById('modalSmart').classList.remove('active');
  }

  document.getElementById('videoModal').addEventListener('click', function(e) { if(e.target === this) cerrarSimulacion(); });
  document.getElementById('modalPisos').addEventListener('click', function(e) { if(e.target === this) cerrarModalPisos(); });
  document.getElementById('modalAulaVirtual').addEventListener('click', function(e) { if(e.target === this) cerrarModalAulaVirtual(); });
  document.getElementById('modalGPS').addEventListener('click', function(e) { if(e.target === this) cerrarGPS(); });
  document.getElementById('modalSmart').addEventListener('click', function(e) { if(e.target === this) cerrarModalSmart(); });