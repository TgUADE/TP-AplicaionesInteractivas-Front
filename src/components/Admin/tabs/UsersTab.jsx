import Button from "../../UI/Button";

const UsersTab = ({ users, loading, onExport }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <p className="text-gray-500">Listado de usuarios para campañas.</p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onExport}
          className="bg-black text-white rounded-full px-6 h-10"
        >
          Exportar Excel
        </Button>
      </div>
    </div>

    <div className="bg-white rounded-2xl border">
      {loading ? (
        <div className="p-6">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Apellido</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Direccion</th>
                <th className="px-4 py-3">Ciudad</th>
                <th className="px-4 py-3">Codigo Postal</th>
                <th className="px-4 py-3">Pais</th>
                <th className="px-4 py-3">Telefono</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{u.name ?? "-"}</td>
                  <td className="px-4 py-3">{u.surname ?? "-"}</td>
                  <td className="px-4 py-3">{u.email ?? "-"}</td>
                  <td className="px-4 py-3">{u.address ?? "-"}</td>
                  <td className="px-4 py-3">{u.city ?? "-"}</td>
                  <td className="px-4 py-3">{u.zip ?? "-"}</td>
                  <td className="px-4 py-3">{u.country ?? "-"}</td>
                  <td className="px-4 py-3">{u.phone ?? "-"}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    Sin usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default UsersTab;
