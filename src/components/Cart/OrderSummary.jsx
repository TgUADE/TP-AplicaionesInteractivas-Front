import Button from "../UI/Button"
const OrderSummary = ({ cartProducts, calculateTotal, isCreating, cart, isLocalCart, handleProceedToCheckout }) => {
    return(
        <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
                </h2>

                <div className="space-y-2 mb-4">
                {cartProducts.map((item) => (
                    <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                    >
                    <span>
                        {item.product?.name} x {item.quantity}
                    </span>
                    <span>
                        $
                        {(
                        (item.product?.current_price ||
                            item.product?.price ||
                            0) * item.quantity
                        ).toFixed(2)}
                    </span>
                    </div>
                ))}
                </div>

                <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                </div>
                </div>

                <Button
                className="w-full mt-4"
                disabled={isCreating || !cart?.id || isLocalCart}
                onClick={handleProceedToCheckout}
                >
                {isCreating ? "Processing..." : "Proceed to Checkout"}
                </Button>

                {isLocalCart && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Log in to proceed to checkout
                </p>
                )}
            </div>
            </div>
    )
}
export default OrderSummary;