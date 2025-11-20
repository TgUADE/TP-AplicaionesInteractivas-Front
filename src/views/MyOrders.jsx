import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/UI/LoadingSpinner";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { useAuth } from "../hook/useAuth";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800 border border-amber-200",
  SHIPPED: "bg-green-100 text-green-800 border border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border border-red-200",
};

const parseOrderItems = (order) => {
  if (!order) return [];
  if (Array.isArray(order.products)) return order.products;
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.orderItems)) return order.orderItems;
  if (order.productsJson) {
    try {
      const parsed =
        typeof order.productsJson === "string"
          ? JSON.parse(order.productsJson)
          : order.productsJson;
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing order products", error);
    }
  }
  return [];
};

const getOrderId = (order) => order?.id ?? order?.orderId ?? order?._id ?? "N/A";

const getItemName = (item) =>
  item?.productName ??
  item?.name ??
  item?.product?.name ??
  item?.product_title ??
  `Product ${item?.product_id ?? ""}`;

const getItemQty = (item) =>
  Number(
    item?.quantity ??
      item?.qty ??
      item?.amount ??
      item?.count ??
      item?.units ??
      1
  );

const getItemPrice = (item) =>
  Number(
    item?.price ??
      item?.unit_price ??
      item?.unitPrice ??
      item?.product?.price ??
      item?.subtotal ??
      0
  );

const getItemSubtotal = (item) => {
  if (item?.subtotal !== undefined) {
    return Number(item.subtotal);
  }
  return getItemQty(item) * getItemPrice(item);
};

const formatMoney = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return `$${Number(value).toFixed(2)}`;
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString() : "Date not available";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isInitialized } = useAuth();

  const {
    myOrders = [],
    myOrdersLoading = false,
    myOrdersError = null,
    myOrdersLoaded = false,
  } = useSelector((state) => state.orders ?? {});

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate("/auth");
    }
  }, [isInitialized, isLoggedIn, navigate]);

  useEffect(() => {
    if (
      isInitialized &&
      isLoggedIn &&
      !myOrdersLoading &&
      !myOrdersLoaded
    ) {
      dispatch(fetchMyOrders());
    }
  }, [
    dispatch,
    isInitialized,
    isLoggedIn,
    myOrdersLoaded,
    myOrdersLoading,
  ]);

  const handleRetry = useCallback(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const ordersWithItems = useMemo(
  () =>
    (Array.isArray(myOrders) ? myOrders : [])
      .map((order) => ({
        order,
        items: parseOrderItems(order),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.order?.createdAt ?? a.order?.created_at ?? 0);
        const dateB = new Date(b.order?.createdAt ?? b.order?.created_at ?? 0);
        return dateB - dateA; 
      }),
  [myOrders]
);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="large" text="Preparing your orders..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (myOrdersLoading && !myOrdersLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your orders..." />
      </div>
    );
  }

  if (myOrdersError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            We couldn't load your orders
          </h2>
          <p className="text-gray-600 mb-6">{myOrdersError}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <section className="py-16 bg-white w-full px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600">
              Here you'll find the purchase history made with your account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Continue shopping
            </button>
            <button
              onClick={handleRetry}
              className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={myOrdersLoading}
            >
              {myOrdersLoading ? "Updating..." : "Refresh"}
            </button>
          </div>
        </div>

        {myOrdersLoading && myOrdersLoaded && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Updating orders list...
          </div>
        )}

        {ordersWithItems.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-gray-300 bg-gray-50">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              You haven't made any purchases yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              When you confirm your first order, you'll see it listed here along with
              all the purchase details.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200"
            >
              Explore products
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {ordersWithItems.map(({ order, items }) => {
              const orderId = getOrderId(order);
              const statusKey = (order?.status ?? "").toUpperCase();
              const statusBadgeClass =
                statusStyles[statusKey] ??
                "bg-gray-100 text-gray-700 border border-gray-200";

              return (
                <article
                  key={orderId}
                  className="border border-gray-200 rounded-3xl shadow-sm overflow-hidden"
                >
                  <div className="p-6 md:p-8 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Order #{orderId}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(order?.createdAt ?? order?.created_at)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass}`}>
                        {order?.status ?? "NO STATUS"}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 text-sm text-gray-700">
                      <div>
                        <p className="text-gray-500 mb-1">Total</p>
                        <p className="font-semibold text-gray-900">
                          {formatMoney(
                            order?.totalAmount ??
                              order?.total ??
                              order?.amount ??
                              order?.total_amount
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Payment method</p>
                        <p className="font-semibold text-gray-900">
                          {order?.paymentMethod ??
                            order?.payment_method ??
                            "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Shipping address</p>
                        <p className="font-semibold text-gray-900 whitespace-pre-line">
                          {order?.shippingAddress ??
                            order?.shipping_address ??
                            "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">
                          Billing address
                        </p>
                        <p className="font-semibold text-gray-900 whitespace-pre-line">
                          {order?.billingAddress ??
                            order?.billing_address ??
                            order?.shippingAddress ??
                            order?.shipping_address ??
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                        Order products
                      </h3>
                      {items.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                          No products associated with this order.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item, idx) => (
                            <div
                              key={`${orderId}-${idx}`}
                              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-2xl px-4 py-3"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {getItemName(item)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Quantity: {getItemQty(item)} · Unit price:{" "}
                                  {formatMoney(getItemPrice(item))}
                                </p>
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                {formatMoney(getItemSubtotal(item))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyOrders;