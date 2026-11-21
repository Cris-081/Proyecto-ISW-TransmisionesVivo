import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { labelRol } from "../helpers/labels.js";
import { ROLES_GESTION } from "../helpers/roles.js";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiVideo,
  FiGrid,
  FiRadio,
  FiCalendar,
  FiPlusCircle,
  FiBriefcase,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";
import "../styles/Sidebar.css";



const P = { size: 18, "aria-hidden": true };

const ICONS = {
  home: <FiHome {...P} />,
  users: <FiUser {...P} />,
  team: <FiUsers {...P} />,
  camera: <FiVideo {...P} />,
  panel: <FiGrid {...P} />,
  vivo: <FiRadio {...P} />,
  calendar: <FiCalendar {...P} />,
  plus: <FiPlusCircle {...P} />,
  clients: <FiBriefcase {...P} />,
  pagos: <FiCreditCard {...P} />,
  logout: <FiLogOut {...P} />,
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
      { to: "/admin/usuarios", label: "Usuarios", icon: "users" },
      { to: "/admin/equipos", label: "Equipos", icon: "team" },
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