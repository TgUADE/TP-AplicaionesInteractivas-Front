import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import useOrder from "../hook/useOrder";
import { useCart } from "../hook/useCart";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, isLoggedIn } = useAuth();
  const { createOrder } = useOrder();
  const { createCart } = useCart();
  const [processingOrder, setProcessingOrder] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  // Obtener datos de la URL (pasados por Stripe)
  const sessionId = searchParams.get("session_id");
  const cartId = searchParams.get("cartId");
  const shippingAddress = searchParams.get("shipping");
  const billingAddress = searchParams.get("billing");

  useEffect(() => {
    const processPayment = async () => {
      if (hasProcessed) {
        console.log("⏭️ Ya se procesó este pago");
        return;
      }
      if (!sessionId || !cartId || !shippingAddress || !billingAddress) {
        console.error("❌ Faltan datos de la URL");
        setError("Invalid payment data");
        setProcessingOrder(false);
        return;
      }

      // Validar autenticación
      if (!isLoggedIn || !token) {
        console.log("⏳ Esperando autenticación...");
        return;
      }
      setHasProcessed(true);

      try {
        console.log("✅ Pago exitoso en Stripe, creando orden...");

        // Crear orden directamente (Stripe ya confirmó el pago)
        const orderResult = await createOrder({
          cartId: cartId,
          status: "CONFIRMED",
          shippingAddress: decodeURIComponent(shippingAddress),
          billingAddress: decodeURIComponent(billingAddress),
          paymentMethod: "Stripe",
          //stripeSessionId: sessionId,
        });

        console.log("✅ Orden creada:", orderResult);
        // Solo setear si realmente hay resultado
        if (orderResult) {
          setOrderData(orderResult);
          setError(null); // Limpiar cualquier error

          // Crear nuevo carrito
          console.log("🛒 Creando nuevo carrito...");
          await createCart();
          console.log("✅ Nuevo carrito creado");
        } else {
          throw new Error("No se recibió la orden del backend");
        }
      } catch (err) {
        console.error("❌ Error creating order:", err);
        setError(err.message || "Error creating order");
        setHasProcessed(false);
      } finally {
        setProcessingOrder(false);
      }
    };

    // Solo ejecutar si no estamos ya procesando
    if (processingOrder && !hasProcessed) {
      processPayment();
    }
  }, [
    sessionId,
    cartId,
    isLoggedIn,
    token,
    createOrder,
    createCart,
    shippingAddress,
    billingAddress,
    hasProcessed,
  ]);

  if (processingOrder) {
    return (
      <div className="min-h-screen bg-white w-full flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-600">Creating your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate("/cart")}>Return to Cart</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header de Éxito */}
          <div className="text-center mb-8">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h2>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          {/* Información de la Orden */}
          {orderData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    Order ID
                  </span>
                  <span className="text-sm text-gray-900">#{orderData.id}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    Status
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {orderData.status}
                  </span>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                      Shipping:
                    </span>
                    <span className="text-sm text-gray-900 flex-1">
                      {orderData.shippingAddress}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                      Billing:
                    </span>
                    <span className="text-sm text-gray-900 flex-1">
                      {orderData.billingAddress}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                      Payment:
                    </span>
                    <span className="text-sm text-gray-900 flex-1">
                      {orderData.paymentMethod}
                    </span>
                  </div>

                  {orderData.totalAmount && (
                    <div className="flex items-start gap-2 pt-3 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-gray-900 flex-1">
                        ${orderData.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button onClick={() => navigate("/my-orders")} className="flex-1">
              View My Orders
            </Button>
          </div>

          {/* Información Adicional */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>You will receive an email confirmation shortly.</p>
            <p className="mt-2">Questions? Contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
