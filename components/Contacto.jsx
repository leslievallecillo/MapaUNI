import React, { useEffect, useState } from "react";
import "../Style/contactos.css";

function Contacto() {
  const [datos, setDatos] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    mensaje: ""
  });

  useEffect(() => {
    fetch("./Json/contactos.json")
      .then((response) => response.json())
      .then((data) => setDatos(data))
      .catch((error) => console.log("Error cargando contactos.json:", error));
  }, []);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const endpoint = "  https://formspree.io/f/mjgjnpog";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nombre: formulario.nombre,
          email: formulario.correo, 
          mensaje: formulario.mensaje
        }),
      });

      if (response.ok) {
        alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
        setFormulario({ nombre: "", correo: "", mensaje: "" });
      } else {
        alert("Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  if (!datos) return <p>Cargando información...</p>;

  return (
    <main>
      <section className="contact-section">
        <h2 className="section-title">{datos.titulo}</h2>
        <p className="section-subtitle">{datos.subtitulo}</p>

        <div className="contact-container">
          <div className="contact-form-column">
            <form className="contact-form" onSubmit={enviarFormulario}>
              
              <div className="form-group">
                <label className="form-label">{datos.formulario.nombre.label}</label>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  placeholder={datos.formulario.nombre.placeholder}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{datos.formulario.correo.label}</label>
                <input
                  type="email"
                  name="correo"
                  value={formulario.correo}
                  onChange={handleChange}
                  placeholder={datos.formulario.correo.placeholder}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group-message">
                <label className="form-label">{datos.formulario.mensaje.label}</label>
                <textarea
                  rows="5"
                  name="mensaje"
                  value={formulario.mensaje}
                  onChange={handleChange}
                  placeholder={datos.formulario.mensaje.placeholder}
                  required
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                className="btn-glow submit-button"
                disabled={enviando} 
              >
                <span className="material-icons">send</span>
                {enviando ? "Enviando..." : datos.formulario.boton}
              </button>

            </form>
          </div>

          {/* COLUMNA DE INFORMACIÓN */}
          <div className="contact-info-column">
            <div className="info-card">
              <div className="icon-circle"><span className="material-icons">email</span></div>
              <div>
                <h3 className="info-title">{datos.informacion.correo.titulo}</h3>
                <a href={`mailto:${datos.informacion.correo.email}`} className="info-link">
                  {datos.informacion.correo.email}
                </a>
                <p className="info-small">{datos.informacion.correo.detalle}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-circle"><span className="material-icons">location_on</span></div>
              <div>
                <h3 className="info-title">{datos.informacion.ubicacion.titulo}</h3>
                <p className="info-text">{datos.informacion.ubicacion.detalle}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-circle"><span className="material-icons">groups</span></div>
              <div>
                <h3 className="info-title">{datos.informacion.colaboracion.titulo}</h3>
                <p className="info-text">{datos.informacion.colaboracion.detalle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default Contacto;