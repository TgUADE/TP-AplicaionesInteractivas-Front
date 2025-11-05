import Button from "../../UI/Button";
import LoadingSpinner from "../../UI/LoadingSpinner";

const ProductsTab = ({
  products,
  pagedProducts,
  loading,
  currentPage,
  totalPages,
  pageSize,
  pendingDeleteId,
  onPageChange,
  onOpenCreate,
  onOpenImageModal,
  onOpenEdit,
  onDeleteProduct,
}) => {
  const handlePrev = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const from = products.length ? (currentPage - 1) * pageSize + 1 : 0;
  const to = Math.min(products.length, currentPage * pageSize);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="text-gray-500">Administra tus productos.</p>
        </div>
        <Button
          onClick={onOpenCreate}
          className="bg-black text-white rounded-full px-6 h-10"
        >
          Nuevo producto
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
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {pagedProducts.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">${p.original_price}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">{p.category_name ?? "-"}</td>
                    <td className="px-4 py-3 space-x-2">
                      <Button
                        onClick={() => onOpenImageModal(p)}
                        className="h-9 px-4 rounded-full border"
                      >
                        Fotos
                      </Button>
                      <Button
                        onClick={() => onOpenEdit(p)}
                        className="h-9 px-4 rounded-full border"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => onDeleteProduct(p.id)}
                        className="h-9 px-4 rounded-full border bg-red-600 text-white"
                        disabled={pendingDeleteId === p.id}
                        aria-busy={pendingDeleteId === p.id}
                      >
                        {pendingDeleteId === p.id ? (
                          <LoadingSpinner size="small" color="white" />
                        ) : (
                          "Eliminar"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td className="px-4 py-6" colSpan={5}>
                      Sin productos
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="text-sm text-gray-600">
                        {products.length > 0 ? (
                          <>
                            Mostrando{" "}
                            <span className="font-medium">{from}</span>
                            {" - "}
                            <span className="font-medium">{to}</span>
                            {" de "}
                            <span className="font-medium">
                              {products.length}
                            </span>
                          </>
                        ) : (
                          "Sin productos"
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={handlePrev}
                          disabled={currentPage === 1}
                          className="h-9 px-3"
                        >
                          Anterior
                        </Button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((n) => (
                          <button
                            key={n}
                            onClick={() => onPageChange(n)}
                            className={`h-9 min-w-9 px-3 rounded-md border text-sm ${
                              n === currentPage
                                ? "bg-black text-white border-black"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            {n}
                          </button>
                        ))}

                        <Button
                          variant="outline"
                          onClick={handleNext}
                          disabled={currentPage === totalPages}
                          className="h-9 px-3"
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
