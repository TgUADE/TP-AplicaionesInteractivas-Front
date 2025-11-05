import Modal from "../UI/Modal";
import Input from "../UI/Input";
import Button from "../UI/Button";

const CheckoutModal = ({ showCheckoutModal, setShowCheckoutModal, checkoutData, handleCheckoutInputChange, handleSameAddressChange, sameAddress, calculateTotal, orderError, isCreating, handleConfirmOrder }) => {
    return (
        <Modal
            isOpen={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            title="Checkout"
        >
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <Input
                name="shippingAddress"
                value={checkoutData.shippingAddress}
                onChange={handleCheckoutInputChange}
                placeholder="Street, City, Postal Code, Country"
                className="w-full"
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                type="checkbox"
                id="sameAddress"
                checked={sameAddress}
                onChange={handleSameAddressChange}
                className="rounded"
                />
                <label htmlFor="sameAddress" className="text-sm text-gray-700">
                Billing address same as shipping
                </label>
            </div>

            {!sameAddress && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Address *
                </label>
                <Input
                    name="billingAddress"
                    value={checkoutData.billingAddress}
                    onChange={handleCheckoutInputChange}
                    placeholder="Street, City, Postal Code, Country"
                    className="w-full"
                />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                name="paymentMethod"
                value={checkoutData.paymentMethod}
                onChange={handleCheckoutInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
            </div>

            <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total to pay:</span>
                <span>${calculateTotal().toFixed(2)}</span>
                </div>

                {orderError && (
                <p className="text-sm text-red-600 mb-3">{orderError}</p>
                )}

                <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 background-red-500 border-red-500 hover:bg-red-50 text-red-600"
                    disabled={isCreating}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmOrder}
                    className="flex-1"
                    disabled={isCreating}
                >
                    {isCreating ? "Processing..." : "Confirm Order"}
                </Button>
                </div>
            </div>
            </div>
        </Modal>
    );
};
export default CheckoutModal;