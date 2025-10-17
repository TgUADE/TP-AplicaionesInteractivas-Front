import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useProducts } from "../hook/useProducts";
import { useAuth } from "../hook/useAuth";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import Input from "../components/UI/Input";
import useOrder from "../hook/useOrder";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartItems,
    isLoading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCart,
    createCart,
    isLocalCart,
  } = useCart();
  const { products } = useProducts();
  const { isLoggedIn } = useAuth();
  const [cartProducts, setCartProducts] = useState([]);
  const { createOrder, isLoading: isCreating, error: orderError, order } = useOrder();
  
  // Estado del modal y formulario de checkout
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: "",
    billingAddress: "",
    paymentMethod: "Credit Card",
  });
  const [sameAddress, setSameAddress] = useState(true);
  
  // Estado del modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [confirmedProducts, setConfirmedProducts] = useState([]);

  // Combinar los items del carrito con la información de los productos
  useEffect(() => {
    if (cartItems.length > 0 && products.length > 0) {
      const productsWithDetails = cartItems
        .map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.productId);
          return {
            ...cartItem,
            product: product || null,
          };
        })
        .filter((item) => item.product);

      setCartProducts(productsWithDetails);
    } else {
      setCartProducts([]);
    }
  }, [cartItems, products]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm("¿Are you sure you want to clear the cart?")) {
      await clearCart();
    }
  };

  const calculateTotal = () => {
    return cartProducts.reduce((total, item) => {
      const price = item.product?.current_price || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Abrir modal de checkout
  const handleProceedToCheckout = () => {
    setShowCheckoutModal(true);
  };

  // Manejar cambios en el formulario
  const handleCheckoutInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar checkbox de misma dirección
  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      setCheckoutData(prev => ({
        ...prev,
        billingAddress: prev.shippingAddress
      }));
    }
  };

  // Sincronizar billing con shipping si están iguales
  useEffect(() => {
    if (sameAddress) {
      setCheckoutData(prev => ({
        ...prev,
        billingAddress: prev.shippingAddress
      }));
    }
  }, [checkoutData.shippingAddress, sameAddress]);

  // Confirmar y crear orden
  const handleConfirmOrder = async () => {
    if (!cart?.id) {
      alert("Cart not found");
      return;
    }

    // Validar campos requeridos
    if (!checkoutData.shippingAddress.trim()) {
      alert("Please enter a shipping address");
      return;
    }
    
    // Si sameAddress está marcado, usar shippingAddress como billingAddress
    const finalBillingAddress = sameAddress 
      ? checkoutData.shippingAddress 
      : checkoutData.billingAddress;
    
    if (!finalBillingAddress.trim()) {
      alert("Please enter a billing address");
      return;
    }
    if (!checkoutData.paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const orderData = {
      cartId: cart.id,
      status: "PENDING",
      shippingAddress: checkoutData.shippingAddress,
      billingAddress: finalBillingAddress,
      paymentMethod: checkoutData.paymentMethod,
    };

    const data = await createOrder(orderData);
    if (data) {
      // Guardar la información de la orden y productos para el modal de confirmación
      setConfirmedOrder(data);
      setConfirmedProducts([...cartProducts]);
      
      // Cerrar modal de checkout y abrir modal de confirmación
      setShowCheckoutModal(false);
      setShowConfirmationModal(true);
      
      // Crear un nuevo carrito vacío explícitamente
      // El carrito anterior quedó asociado a la orden
      console.log("🛒 Creando nuevo carrito después de la orden...");
      const newCart = await createCart();
      
      if (newCart) {
        console.log("✅ Nuevo carrito creado:", newCart.id);
        // Emitir evento de actualización del carrito para otros componentes
        window.dispatchEvent(new CustomEvent("cart_updated"));
      }
    } else if (orderError) {
      alert(`Error creating order: ${orderError}`);
    }
  };

  // Función para cerrar el modal de confirmación
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmedOrder(null);
    setConfirmedProducts([]);
    
    // Resetear formulario de checkout para la próxima compra
    setCheckoutData({
      shippingAddress: "",
      billingAddress: "",
      paymentMethod: "Credit Card",
    });
    setSameAddress(true);
  };

  const handleProductClick = (productId, e) => {
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/product/${productId}`);
  };

  if (isLoading && !cart && isLoggedIn) {
    return (
      <div className="min-h-screen bg-white w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" text="Loading cart..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Shopping Cart
          </h1>
          {isLocalCart && (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Temporary cart -{" "}
              <a href="/auth" className="underline">
                Log in
              </a>{" "}
              to save your cart
            </div>
          )}
        </div>

        {cartProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add some products to get started
            </p>
            <Button onClick={() => (window.location.href = "/products")}>
              View Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartProducts.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-gray-50 rounded-lg p-6 flex items-center space-x-4 cursor-pointer"
                    onClick={(e) => handleProductClick(item.productId, e)}
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.product?.images?.[0]?.imageUrl ? (
                        <img
                          src={item.product.images[0].imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-2xl">📦</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.product?.name}
                      </h3>
                      <p className="text-gray-600">
                        ${(item.product?.current_price || item.product?.price || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          );
                        }}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          );
                        }}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ${((item.product?.current_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.productId);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Empty Cart
                </Button>
              </div>
            </div>

            {/* Resumen del pedido */}
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
                      <span>${((item.product?.current_price || item.product?.price || 0) * item.quantity).toFixed(2)}</span>
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
          </div>
        )}

        {/* Modal de Checkout */}
        {showCheckoutModal && (
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
                    className="flex-1"
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
        )}

        {/* Modal de Confirmación de Orden */}
        {showConfirmationModal && confirmedOrder && (
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
                <p className="text-gray-600">
                  Thank you for your purchase
                </p>
              </div>

              {/* Información de la Orden */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Status</span>
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
                          ${((item.product?.current_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${confirmedOrder.totalAmount?.toFixed(2) || 
                      confirmedProducts.reduce((total, item) => {
                        const price = item.product?.current_price || item.product?.price || 0;
                        return total + (price * item.quantity);
                      }, 0).toFixed(2)}
                  </span>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleCloseConfirmationModal();
                      navigate('/products');
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
        )}
      </div>
    </div>
  );
};

export default Cart;