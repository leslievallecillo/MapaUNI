function EquipoComponente() {
    const [integrantes, setIntegrantes] = React.useState([]);

    React.useEffect(() => {
        // Buscamos el JSON en la carpeta Json
        fetch('Json/equipo.json')
            .then(response => response.json())
            .then(data => setIntegrantes(data))
            .catch(err => console.error("Error al cargar equipo:", err));
    }, []);

    return (
        <div className="equipo-grid">
            {integrantes.map((persona, index) => (
                <div className="equipo-card" key={index}>
                    <div className="equipo-avatar">
                        <i className={`fa-solid ${persona.icono}`}></i>
                    </div>
                    <h3>{persona.nombre}</h3>
                    <h4 className="equipo-rol">{persona.rol}</h4>
                </div>
            ))}
        </div>
    );
}

// Renderizamos el componente en el div que dejamos en el HTML
const rootElement = document.getElementById('react-equipo-root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<EquipoComponente />);
}