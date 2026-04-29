import React from 'react';
import datosDestinos from '../Json/destinos.json';

const Destinos = () => {
  const { principales, laboratorios, cafetines } = datosDestinos.categorias;

  const renderCarousel = (titulo, items, index) => (
    <div className="carousel-container anim-element visible" key={`carousel-${index}`}>
      <h3 className="carousel-title">{index}. {titulo}</h3>
      <div className="contenedor-slider">
        <button className="boton-slider anterior" onClick={(e) => desplazar(e, -320)}>
          <span className="material-icons">chevron_left</span>
        </button>
        
        <div className="carousel-track">
          {items.map((item) => (
            <div className="card" key={item.id}>
              <div className="card-img-container">
                <img 
                  src={item.img} 
                  alt={item.nombre} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200/001f3f/ffffff?text=' + item.nombre; }}
                />
              </div>
              <div className="card-body">
                <h3>{item.nombre}</h3>
                <p>{item.desc}</p>
                <button 
                  className="btn-select" 
                  onClick={() => item.tipo === 'complejo' ? window.abrirModalPisos() : window.abrirSimulacion(item.nombre)}
                >
                  <span className="material-icons" style={{ fontSize: '18px', verticalAlign: 'middle' }}>360</span> Entrar
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="boton-slider siguiente" onClick={(e) => desplazar(e, 320)}>
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  );

  const desplazar = (e, cantidad) => {
    const track = e.currentTarget.parentElement.querySelector('.carousel-track');
    if (track) {
      track.scrollBy({ left: cantidad, behavior: 'smooth' });
    }
  };

  return (
    <section id="destinos" className="anim-element visible" style={{ paddingTop: 0 }}>
      <h2 className="section-title">Explorar Entornos 360°</h2>
      {renderCarousel("Edificios Principales", principales, 1)}
      {renderCarousel("Laboratorios", laboratorios, 2)}
      {renderCarousel("Cafetines", cafetines, 3)}
    </section>
  );
};

export default Destinos;