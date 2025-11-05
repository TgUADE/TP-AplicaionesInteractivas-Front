import Button from "../../UI/Button";
import LoadingSpinner from "../../UI/LoadingSpinner";

const PromotionsTab = ({
  promotions,
  loading,
  pendingId,
  onOpenCreate,
  onOpenEdit,
  onActivate,
  onDeactivate,
  onDelete,
}) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Promociones</h1>
        <p className="text-gray-500">Administra tus promociones.</p>
      </div>
      <Button
        onClick={onOpenCreate}
        className="bg-black text-white rounded-full px-6 h-10"
      >
        Nueva promoción
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
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Inicio</th>
                <th className="px-4 py-3">Fin</th>
                <th className="px-4 py-3">Activa</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((pr) => {
                const isPending = pendingId === pr.id;
                const productLabel =
                  pr.product_name ?? pr.product?.name ?? pr.product_id ?? "-";
                const start = pr.start_date
                  ? new Date(pr.start_date).toLocaleString()
                  : "-";
                const end = pr.end_date
                  ? new Date(pr.end_date).toLocaleString()
                  : "-";

                return (
                  <tr key={pr.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{pr.name}</td>
                    <td className="px-4 py-3">{pr.type}</td>
                    <td className="px-4 py-3">{pr.value}</td>
                    <td className="px-4 py-3">{productLabel}</td>
                    <td className="px-4 py-3">{start}</td>
                    <td className="px-4 py-3">{end}</td>
                    <td className="px-4 py-3">
                      {pr.active ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <Button
                        onClick={() => onOpenEdit(pr)}
                        className="h-9 px-4 rounded-full border"
                      >
                        Editar
                      </Button>
                      {pr.active ? (
                        <Button
                          onClick={() => onDeactivate(pr.id)}
                          className="h-9 px-4 rounded-full border"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <LoadingSpinner size="small" color="gray" />
                          ) : (
                            "Desactivar"
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onActivate(pr.id)}
                          className="h-9 px-4 rounded-full border"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <LoadingSpinner size="small" color="gray" />
                          ) : (
                            "Activar"
                          )}
                        </Button>
                      )}
                      <Button
                        onClick={() => onDelete(pr.id)}
                        className="h-9 px-4 rounded-full border bg-red-600 text-white"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {promotions.length === 0 && (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    Sin promociones
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

export default PromotionsTab;
