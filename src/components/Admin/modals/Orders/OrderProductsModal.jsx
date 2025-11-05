import Button from "../../../UI/Button";
import Modal from "../../../UI/Modal";

const OrderProductsModal = ({
  isOpen,
  items,
  onClose,
  getItemName,
  getItemQty,
  getItemPrice,
  getItemSubtotal,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Productos de la orden"
    size="large"
  >
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Cantidad</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map((it, idx) => {
              const name = getItemName(it);
              const qty = getItemQty(it);
              const price = getItemPrice(it);
              const subtotal = getItemSubtotal(it);
              return (
                <tr
                  key={it.id ?? it.productId ?? it.product_id ?? idx}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-3">{name}</td>
                  <td className="px-4 py-3">{qty}</td>
                  <td className="px-4 py-3">${price}</td>
                  <td className="px-4 py-3">${subtotal}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="px-4 py-6" colSpan={4}>
                Sin productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="flex justify-end pt-3">
      <Button
        onClick={onClose}
        className="bg-black text-white rounded-full px-6 h-10"
      >
        Cerrar
      </Button>
    </div>
  </Modal>
);

export default OrderProductsModal;
