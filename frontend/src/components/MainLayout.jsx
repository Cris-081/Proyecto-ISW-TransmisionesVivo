import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar.jsx";

// sidebar izquierda y pagina derecha
export default function MainLayout() {
  const [open, setOpen] = useState(false);

  // Esto es para el movil
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="layout">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="layout-main">
        <header className="mobile-bar">
          <button
            type="button"
            className="menu-toggle"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="app-sidebar"
            onClick={() => setOpen(true)}
          >
            <FiMenu size={22} aria-hidden="true" />
          </button>
          <span className="wordmark small">EnVivo</span>
        </header>

        <Outlet />
      </div>
    </div>
  );
}