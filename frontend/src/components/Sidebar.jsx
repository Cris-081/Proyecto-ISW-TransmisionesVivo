import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { labelRol } from "../helpers/labels.js";
import { ROLES_GESTION } from "../helpers/roles.js";
import "../styles/Sidebar.css";


function Icon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  home: (
    <Icon>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </Icon>
  ),
  users: (
    <Icon>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 4.6a3.5 3.5 0 010 6.8" />
      <path d="M18 14.3c2.2.7 3.5 2.6 3.5 5.7" />
    </Icon>
  ),
  camera: (
    <Icon>
      <rect x="2" y="6" width="13" height="12" rx="2" />
      <path d="M15 10l7-4v12l-7-4" />
    </Icon>
  ),
  panel: (
    <Icon>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </Icon>
  ),
  vivo: (
    <Icon>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </Icon>
  ),
  calendar: (
    <Icon>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </Icon>
  ),
  plus: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </Icon>
  ),
  clients: (
    <Icon>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14c2.5 0 4.5 1.8 4.5 4.5" />
    </Icon>
  ),
  pagos: (
    <Icon>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 10h19M6.5 15h4" />
    </Icon>
  ),
  logout: (
    <Icon>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  ),
};

/* Menu
   Para agregar una opcion nueva, anade un item aqui.
   `roles` (opcional) limita el grupo o la opcion a esos roles*/
const NAV_GROUPS = [
  {
    title: null,
    items: [{ to: "/", label: "Inicio", icon: "home" }],
  },
  {
    title: "Cobertura",
    items: [
      { to: "/panel", label: "Panel general", icon: "panel", roles: ROLES_GESTION },
      { to: "/cobertura", label: "Cobertura en vivo", icon: "vivo" },
      { to: "/calendario", label: "Calendario", icon: "calendar" },
      { to: "/programar", label: "Programar transmision", icon: "plus", roles: ROLES_GESTION },
      { to: "/clientes", label: "Clientes y precios", icon: "clients", roles: ROLES_GESTION },
      { to: "/pagos", label: "Pagos", icon: "pagos", roles: ROLES_GESTION },
    ],
  },
  {
    title: "Administracion",
    roles: ["admin"],
    items: [
      { to: "/admin", label: "Usuarios y equipos", icon: "users" },
      { to: "/admin/inventario", label: "Inventario de kits", icon: "camera" },
    ],
  },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { user, logout } = useAuth();

  const permitido = (roles) => !roles || roles.includes(user.role);
  const groups = NAV_GROUPS.filter((g) => permitido(g.roles))
    .map((g) => ({ ...g, items: g.items.filter((i) => permitido(i.roles)) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <div
        className={`sidebar-backdrop${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside id="app-sidebar" className={`sidebar${open ? " is-open" : ""}`}>
        <div className="sidebar-brand">EnVivo</div>

        <nav className="sidebar-nav" aria-label="Navegacion principal">
          {groups.map((group, i) => (
            <div className="sidebar-group" key={group.title || i}>
              {group.title && <p className="sidebar-group-title">{group.title}</p>}
              <ul>
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end
                      onClick={onClose}
                      className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                    >
                      {ICONS[item.icon]}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-user-name">{user.nombre}</span>
            <span className="sidebar-user-role">{labelRol(user.role)}</span>
          </div>
          <button type="button" className="sidebar-logout" onClick={logout}>
            {ICONS.logout}
            <span>Cerrar sesion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
