import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../hook/useCart";
import { useProducts } from "../hook/useProducts";
import { useAuth } from "../hook/useAuth";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";
import useOrder from "../hook/useOrder";
import EmptyCart from "../components/Cart/EmptyCart";
import CartProducts from "../components/Cart/CartProducts";
import OrderSummary from "../components/Cart/OrderSummary";
import CheckoutModal from "../components/Cart/CheckoutModal";
import OrderConfirmed from "../components/Cart/OrderConfirmed";
import Toast from "../components/UI/Toast";
import useToast from "../hook/useToast";
import ClearCartModal from "../components/Cart/ClearCartModal";
import { createCheckoutSession } from "../redux/slices/stripeSlice";
//import { getStripe } from "../lib/stripe";
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useProducts();
  const { isLoggedIn, token } = useAuth();
  const [cartProducts, setCartProducts] = useState([]);
  const {
    //createOrder,
    isLoading: isCreating,
    error: orderError,
    //order,
  } = useOrder();
  const { toast, showToast, dismissToast } = useToast();
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const { loading: stripeLoading, error: stripeError } = useSelector(
    (state) => state.stripe
  );
  
  // Callbacks para cart basados en Redux
  const cartCallbacks = useMemo(() => ({
    onUpdateSuccess: () => {
      showToast("Cart updated", "success");
    },
    onUpdateError: (error) => {
      console.error("Error updating cart:", error);
      showToast(error || "Error updating cart", "error");
    },
    onRemoveSuccess: () => {
      showToast("Product removed from cart", "success");
    },
    onRemoveError: (error) => {
      console.error("Error removing product from cart:", error);
      showToast(error || "Error removing product from cart", "error");
    },
    onClearSuccess: () => {
      showToast("Cart cleared", "success");
      setShowClearCartModal(false);
      setIsClearingCart(false);
    },
    onClearError: (error) => {
      console.error("Error clearing cart:", error);
      showToast(error || "Error clearing cart", "error");
      setIsClearingCart(false);
    },
  }), [showToast]);

  const {
    cart,
    cartItems,
    isLoading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    //getCart,
    //createCart,
    isLocalCart,
  } = useCart(cartCallbacks);

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
    if (cartItems.length > 0) {
      const productsWithDetails = cartItems.map((cartItem) => {
        const product =
          products.find((p) => p.id === cartItem.productId) || null;
        return { ...cartItem, product };
      });

      setCartProducts(productsWithDetails);
    } else {
      setCartProducts([]);
    }
  }, [cartItems, products]);

  const handleQuantityChange = (productId, newQuantity) => {
    // El toast se mostrará automáticamente por callbacks de Redux
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    // El toast se mostrará automáticamente por callbacks de Redux
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    setIsClearingCart(true);
    // El toast se mostrará automáticamente por callbacks de Redux
    clearCart();
  };

  const calculateTotal = () => {
    return cartProducts.reduce((total, item) => {
      const price = item.product?.current_price || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Abrir modal de checkout para obtener direcciones
  const handleProceedToCheckout = () => {
    setShowCheckoutModal(true);
  };

  // Manejar el pago con Stripe
  const handleStripeCheckout = async () => {
    if (!cart?.id) {
      showToast("Cart not found", "error");
      return;
    }

    // Validar que hay productos en el carrito
    if (cartProducts.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    // Validar campos requeridos
    if (!checkoutData.shippingAddress.trim()) {
      showToast("Please enter a shipping address", "error");
      return;
    }

    const finalBillingAddress = sameAddress
      ? checkoutData.shippingAddress
      : checkoutData.billingAddress;

    if (!finalBillingAddress.trim()) {
      showToast("Please enter a billing address", "error");
      return;
    }

    try {
      console.log("🚀 Iniciando creación de sesión de Stripe...");
      console.log("📦 Cart ID:", cart.id);
      console.log("📦 Productos:", cartProducts);
      console.log("📍 Shipping:", checkoutData.shippingAddress);
      console.log("📍 Billing:", finalBillingAddress);
      // Crear sesión de Stripe Checkout con los productos
      const result = await dispatch(
        createCheckoutSession({
          cartProducts: cartProducts,
          cartId: cart.id,
          checkoutData: {
            shippingAddress: checkoutData.shippingAddress,
            billingAddress: finalBillingAddress,
          },
          token,
        })
      ).unwrap();
      console.log("✅ Respuesta del backend:", result);
      console.log("📋 Session ID:", result.sessionId);

      // Cerrar el modal antes de redirigir
      setShowCheckoutModal(false);

      // Usar la URL que devuelve el backend
      if (result.url) {
        console.log("🔄 Redirigiendo a Stripe:", result.url);
        console.log("📋 Session ID:", result.sessionId);

        // Redirigir usando la URL completa de Stripe
        window.location.href = result.url;
      } else {
        console.error("❌ No se recibió URL del backend");
        showToast("Error: No checkout URL received", "error");
      }
    } catch (err) {
      console.error("❌ Error completo:", err);
      console.error("❌ Error tipo:", typeof err);
      console.error("❌ Error mensaje:", err.message || err);
      console.error("❌ Error stack:", err.stack);
      showToast(err || "Error creating checkout session", "error");
    }
  };

  // Manejar cambios en el formulario
  const handleCheckoutInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar checkbox de misma dirección
  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      setCheckoutData((prev) => ({
        ...prev,
        billingAddress: prev.shippingAddress,
      }));
    }
  };

  // Sincronizar billing con shipping si están iguales
  useEffect(() => {
    if (sameAddress) {
      setCheckoutData((prev) => ({
        ...prev,
        billingAddress: prev.shippingAddress,
      }));
    }
  }, [checkoutData.shippingAddress, sameAddress]);

  // Confirmar y crear orden
  /*
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
  */
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
    if (e.target.closest("button")) {
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
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
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
        {/* Carrito vacío */}
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <CartProducts
              cartProducts={cartProducts}
              handleProductClick={handleProductClick}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
              handleClearCart={() => setShowClearCartModal(true)}
            />

            {/* Resumen del pedido */}
            <OrderSummary
              cartProducts={cartProducts}
              calculateTotal={calculateTotal}
              isCreating={isCreating || stripeLoading}
              cart={cart}
              isLocalCart={isLocalCart}
              handleProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        )}

        {/* Modal de Checkout */}
        {showCheckoutModal && (
          <CheckoutModal
            showCheckoutModal={showCheckoutModal}
            setShowCheckoutModal={setShowCheckoutModal}
            checkoutData={checkoutData}
            handleCheckoutInputChange={handleCheckoutInputChange}
            handleSameAddressChange={handleSameAddressChange}
            sameAddress={sameAddress}
            calculateTotal={calculateTotal}
            orderError={stripeError || orderError}
            isCreating={isCreating || stripeLoading}
            handleConfirmOrder={handleStripeCheckout}
          />
        )}

        {/* Modal de Confirmación de Orden */}
        {showConfirmationModal && confirmedOrder && (
          <OrderConfirmed
            showConfirmationModal={showConfirmationModal}
            handleCloseConfirmationModal={handleCloseConfirmationModal}
            confirmedOrder={confirmedOrder}
            confirmedProducts={confirmedProducts}
            navigate={navigate}
          />
        )}
        {/* Modal de Clear Cart */}
        <ClearCartModal
          isOpen={showClearCartModal}
          onClose={() => setShowClearCartModal(false)}
          onConfirm={handleClearCart}
          isLoading={isClearingCart}
        />
      </div>

      <Toast toast={toast} onClose={dismissToast} />
    </div>
  );
};

export default Cart;
