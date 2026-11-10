const IconoCalendario = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="3" />
    <path d="M3 9h18M8 2v4M16 2v4" />
  </svg>
);

const IconoMas = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const ITEMS = [
  { id: "calendario", etiqueta: "Calendario", Icono: IconoCalendario },
  { id: "programar", etiqueta: "Programar transmisión", Icono: IconoMas },
];

export default function Sidebar({ vista, onCambiar }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-marca">
        <span className="punto-rojo" />
        <span>Panel de cobertura</span>
      </div>

      <nav className="sidebar-nav" aria-label="Secciones">
        {ITEMS.map(({ id, etiqueta, Icono }) => (
          <button
            key={id}
            type="button"
            className={`nav-item ${vista === id ? "activo" : ""}`}
            aria-current={vista === id ? "page" : undefined}
            onClick={() => onCambiar(id)}
          >
            <Icono />
            <span>{etiqueta}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}