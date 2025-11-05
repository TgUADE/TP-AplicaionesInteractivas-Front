import Modal from "../UI/Modal";
import Button from "../UI/Button";
const OrderConfirmed = ({showConfirmationModal, handleCloseConfirmationModal, confirmedOrder, confirmedProducts, navigate}) => {
    return (
        <Modal
            isOpen={showConfirmationModal}
            onClose={handleCloseConfirmationModal}
            title=""
            >
            <div className="space-y-6">
              {/* Encabezado de Éxito */}
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                    />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order Confirmed!
                </h2>
                <p className="text-gray-600">Thank you for your purchase</p>
            </div>

              {/* Información de la Orden */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                    Status
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {confirmedOrder.status}
                </span>
                </div>

                <div className="pt-2 space-y-2">
                <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    Shipping Address:
                    </span>
                    <span className="text-sm text-gray-900 flex-1">
                    {confirmedOrder.shippingAddress}
                    </span>
                </div>

                <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    Billing Address:
                    </span>
                    <span className="text-sm text-gray-900 flex-1">
                    {confirmedOrder.billingAddress}
                    </span>
                </div>

                <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    Payment Method:
                    </span>
                    <span className="text-sm text-gray-900 flex-1">
                    {confirmedOrder.paymentMethod}
                    </span>
                </div>
                </div>
            </div>

              {/* Productos de la Orden */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Order Items
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                {confirmedProducts.map((item) => (
                    <div
                    key={item.productId}
                    className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                    >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product?.images?.[0]?.imageUrl ? (
                        <img
                            src={item.product.images[0].imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        ) : (
                        <div className="text-xl">📦</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                        $
                        {(
                            (item.product?.current_price ||
                            item.product?.price ||
                              0) * item.quantity
                        ).toFixed(2)}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            </div>

              {/* Total */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                    Total
                </span>
                <span className="text-2xl font-bold text-gray-900">
                    $
                    {confirmedOrder.totalAmount?.toFixed(2) ||
                    confirmedProducts
                        .reduce((total, item) => {
                        const price =
                            item.product?.current_price ||
                            item.product?.price ||
                            0;
                          return total + price * item.quantity;
                        }, 0)
                        .toFixed(2)}
                </span>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={() => {
                    handleCloseConfirmationModal();
                    navigate("/products");
                    }}
                    className="flex-1"
                >
                    Continue Shopping
                </Button>
                <Button
                    onClick={handleCloseConfirmationModal}
                    className="flex-1"
                >
                    Close
                </Button>
                </div>
            </div>
            </div>
        </Modal>
    )
};
export default OrderConfirmed;