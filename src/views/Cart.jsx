import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useProducts } from "../hook/useProducts";
import { useAuth } from "../hook/useAuth";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";

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
    isLocalCart,
  } = useCart();
  const { products } = useProducts();
  const { isLoggedIn } = useAuth();
  const [cartProducts, setCartProducts] = useState([]);

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
        .filter((item) => item.product); // Solo incluir productos que existen

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

  const handleProductClick = (productId, e) => {
    // Don't navigate if clicking on interactive elements
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/product/${productId}`);
  };

  const calculateTotal = () => {
    return cartProducts.reduce((total, item) => {
      const price = item.product?.current_price || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
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
                    className="bg-gray-50 rounded-lg p-6 flex items-center space-x-4 cursor-pointer "
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

                <Button className="w-full mt-4" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
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
      </div>
    </div>
  );
};

export default Cart;
