import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Style/guia.css';

const GuiaCampus = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    fetch('Json/guia.json')
      .then(res => res.json())
      .then(data => setFavoritos(data));
      
    const resenasGuardadas = JSON.parse(localStorage.getItem('resenas_uniway')) || [];
    setResenas(resenasGuardadas);
  }, []);

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nuevaResena = {
        lugarId: seleccionado.id,
        nombre: formData.get('nombre'),
        calificacion: formData.get('calificacion'),
        mensaje: formData.get('mensaje')
    };

    const actualizadas = [...resenas, nuevaResena];
    setResenas(actualizadas);
    localStorage.setItem('resenas_uniway', JSON.stringify(actualizadas));

    Swal.fire({
        title: '¡Guardado!',
        text: 'Tu comentario ha sido almacenado localmente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
    
    e.target.reset();
  };

  const resenasDelLugar = resenas.filter(r => seleccionado && r.lugarId === seleccionado.id);

  return (
    <div className="vista activa">
      <section id="recomendaciones" className="anim-element visible">
        <h2 className="section-title">Nuestros Favoritos</h2>
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
              </div>
              
              <div className="info-texto-modal">
                <h4>Descripción</h4>
                <p>{seleccionado.descripcion}</p>
              </div>
              
              <div className="info-texto-modal">
                <h4 style={{ color: seleccionado.color }}>¿Por qué lo recomendamos?</h4>
                <p>{seleccionado.recomendacion}</p>
              </div>

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#333', fontSize: '15px', marginBottom: '10px', borderBottom: '2px solid #ddd', paddingBottom: '5px', textAlign: 'left' }}>Opiniones de Estudiantes</h4>
                <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '15px' }}>
                    {resenasDelLugar.length > 0 ? (
                        resenasDelLugar.map((r, index) => (
                            <div key={index} style={{ background: '#f1f3f5', padding: '10px', borderRadius: '6px', marginBottom: '10px', textAlign: 'left' }}>
                                <strong style={{ color: 'var(--primary-color)', fontSize: '14px' }}>{r.nombre}</strong> 
                                <span style={{ color: '#f39c12', fontSize: '13px', marginLeft: '5px' }}>(Nota: {r.calificacion}/5)</span>
                                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#555' }}>{r.mensaje}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ fontSize: '13px', color: '#777', textAlign: 'center' }}>Aún no hay opiniones. ¡Sé el primero!</p>
                    )}
                </div>
              </div>

              <form className="formulario-guia" onSubmit={manejarEnvio}>
                <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Añadir Reseña</h4>
                <label>Tu nombre:</label>
                <input type="text" name="nombre" required />
                <label>Calificación:</label>
                <select name="calificacion" required>
                    <option value="">Seleccionar...</option>
                    <option value="5">Excelente</option>
                    <option value="4">Muy bueno</option>
                    <option value="3">Bueno</option>
                    <option value="2">Regular</option>
                    <option value="1">Malo</option>
                </select>
                <label>Tu opinión:</label>
                <textarea name="mensaje" required></textarea>
                <button type="submit" className="btn-enviar-resena">
                  Guardar Opinión
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