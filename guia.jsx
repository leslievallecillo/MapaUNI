import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import './Style/guia.css';

const GuiaCampus = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch('Json/guia.json')
      .then(res => res.json())
      .then(data => setFavoritos(data));
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const formspreeUrl = "https://formspree.io/f/mdayqwgp"; 

    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // SWEETALERT DE ÉXITO
        Swal.fire({
            title: '¡Mensaje enviado!',
            text: 'Tu comentario ha sido enviado correctamente.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false
        }).then(() => {
            setSeleccionado(null);
        });
      } else {
        // SWEETALERT DE ERROR (Falta ID)
        Swal.fire({
            title: 'Error',
            text: 'Error al enviar. Revisa tu ID de Formspree.',
            icon: 'error',
            confirmButtonColor: '#0056b3'
        });
      }
    } catch (error) {
      // SWEETALERT DE ERROR DE RED
      Swal.fire({
          title: 'Error de conexión',
          text: 'Ocurrió un error de red. Inténtalo más tarde.',
          icon: 'error',
          confirmButtonColor: '#0056b3'
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="vista activa">
      <section id="recomendaciones" className="anim-element visible">
        <h2 className="section-title">Nuestros Favoritos</h2>
        <p className="section-subtitle">Haz clic sobre las tarjetas para ver detalles y enviar tus comentarios.</p>
        
        <div className="recomendaciones-container">
          {favoritos.map(fav => (
            <div key={fav.id} className="rec-card" onClick={() => setSeleccionado(fav)}>
              <div className="rec-content">
                <div className="rec-icon"><span className="material-icons">{fav.icono}</span></div>
                <h3>{fav.titulo}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {seleccionado && (
        <div className="modal-overlay active">
          <div className="modal-content" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{seleccionado.titulo}</h3>
              <button className="close-btn" onClick={() => setSeleccionado(null)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="modal-body" style={{ display: 'block', padding: '30px' }}>
              
              <div className="contenedor-media-modal">
                <img src={seleccionado.imagen} className="imagen-lugar" alt={seleccionado.titulo} />
                <iframe src={seleccionado.mapa_url} className="mapa-iframe" allowFullScreen loading="lazy"></iframe>
              </div>
              
              <div className="info-texto-modal">
                <h4>Descripción</h4>
                <p>{seleccionado.descripcion}</p>
              </div>
              
              <div className="info-texto-modal">
                <h4 style={{ color: seleccionado.color }}>¿Por qué lo recomendamos?</h4>
                <p>{seleccionado.recomendacion}</p>
              </div>

              <form className="formulario-guia" onSubmit={manejarEnvio}>
                <h4>Enviar Comentario</h4>
                <label>Tu nombre:</label>
                <input type="text" name="nombre" required />
                
                <label>Calificación:</label>
                <select name="calificacion" required>
                    <option value="">Seleccionar...</option>
                    <option value="5">Excelente</option>
                    <option value="4">Muy bueno</option>
                    <option value="3">Bueno</option>
                </select>

                <label>Tu opinión:</label>
                <textarea name="mensaje" required></textarea>
                
                <input type="hidden" name="lugar" value={seleccionado.titulo} />

                <button type="submit" className="btn-enviar-resena" disabled={enviando}>
                  {enviando ? "Enviando..." : "Enviar a Formspree"}
                </button>
              </form>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuiaCampus;