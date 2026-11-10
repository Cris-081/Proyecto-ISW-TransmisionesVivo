const IconoPanel = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </svg>
);

const IconoVivo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
);

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

const IconoClientes = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M17 14c2.5 0 4.5 1.8 4.5 4.5" />
  </svg>
);

const IconoPagos = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M2.5 10h19M6.5 15h4" />
  </svg>
);


const ITEMS = [
  { id: "panel", etiqueta: "Panel general", Icono: IconoPanel },
  { id: "cobertura", etiqueta: "Cobertura en vivo", Icono: IconoVivo },
  { id: "calendario", etiqueta: "Calendario", Icono: IconoCalendario },
  { id: "clientes", etiqueta: "Clientes y precios", Icono: IconoClientes },
  { id: "programar", etiqueta: "Programar transmisión", Icono: IconoMas },
  { id: "pagos", etiqueta: "Pagos", Icono: IconoPagos },
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