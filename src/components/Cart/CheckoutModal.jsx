import Modal from "../UI/Modal";
import Input from "../UI/Input";
import Button from "../UI/Button";

const CheckoutModal = ({
  showCheckoutModal,
  setShowCheckoutModal,
  checkoutData,
  handleCheckoutInputChange,
  handleSameAddressChange,
  sameAddress,
  calculateTotal,
  orderError,
  isCreating,
  handleConfirmOrder,
}) => {
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

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total to pay:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Secure Payment with Stripe
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  You will be redirected to Stripe to complete your payment
                  securely.
                </p>
              </div>
            </div>
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
              {isCreating ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default CheckoutModal;
