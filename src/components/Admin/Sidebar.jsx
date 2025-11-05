import { NavLink } from "react-router-dom";

const TABS = [
  { id: "productos", label: "Productos", to: "products" },
  { id: "promociones", label: "Promociones", to: "promotions" },
  { id: "categorias", label: "Categorías", to: "categories" },
  { id: "usuarios", label: "Usuarios", to: "users" },
  { id: "ordenes", label: "Ordenes", to: "orders" },
];

const AdminSidebar = () => (
  <aside className="w-64 border-r">
    <div className="p-6 border-b">
      <h2 className="text-xl font-semibold">Configuración</h2>
    </div>
    <nav className="p-4 space-y-2">
      {TABS.map(({ id, label, to }) => (
        <NavLink
          key={id}
          to={to}
          end
          className={({ isActive }) =>
            `block w-full px-4 py-2 rounded text-left transition-colors ${
              isActive
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
