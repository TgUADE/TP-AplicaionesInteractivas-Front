import Button from "../../UI/Button";

const CategoriesTab = ({
  categories,
  loading,
  onOpenCreate,
  onOpenEdit,
  onDelete,
}) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Categorías</h1>
        <p className="text-gray-500">Administra tus categorías.</p>
      </div>
      <Button
        onClick={onOpenCreate}
        className="bg-black text-white rounded-full px-6 h-10"
      >
        Nueva categoría
      </Button>
    </div>

    <div className="bg-white rounded-2xl border">
      {loading ? (
        <div className="p-6">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{c.description}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Button
                      onClick={() => onOpenEdit(c)}
                      className="h-9 px-4 rounded-full border"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => onDelete(c.id)}
                      className="h-9 px-4 rounded-full border bg-red-600 text-white"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td className="px-4 py-6" colSpan={2}>
                    Sin categorías
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

export default CategoriesTab;
