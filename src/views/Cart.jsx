import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useProducts } from "../hook/useProducts";
import { useAuth } from "../hook/useAuth";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import useOrder from "../hook/useOrder";
import EmptyCart from "../components/Cart/EmptyCart";
import CartProducts from "../components/Cart/CartProducts";
import OrderSummary from "../components/Cart/OrderSummary";
import CheckoutModal from "../components/Cart/CheckoutModal";
import OrderConfirmed from "../components/Cart/OrderConfirmed";
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
  const {
    createOrder,
    isLoading: isCreating,
    error: orderError,
    order,
  } = useOrder();

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
              handleClearCart={handleClearCart}
            />

            {/* Resumen del pedido */}
            <OrderSummary
              cartProducts={cartProducts}
              calculateTotal={calculateTotal}
              isCreating={isCreating}
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
            orderError={orderError}
            isCreating={isCreating}
            handleConfirmOrder={handleConfirmOrder}
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
      </div>
    </div>
  );
};

export default Cart;
