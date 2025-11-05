import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hook/useAuth";

import OrdersTab from "../../components/Admin/tabs/OrdersTab";
import OrderProductsModal from "../../components/Admin/modals/Orders/OrderProductsModal";

import {
  getOrders as getOrdersService,
  updateOrderStatus as updateOrderStatusService,
} from "../../services/orders";

const ordersPageSize = 20;

const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "PENDIENTE" },
  { value: "SHIPPED", label: "ENVIADA" },
  { value: "CANCELLED", label: "CANCELADA" },
];

const parseOrderItems = (order) => {
  if (!order) return [];
  if (Array.isArray(order.products)) return order.products;
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.orderItems)) return order.orderItems;
  if (order.productsJson) {
    try {
      const arr =
        typeof order.productsJson === "string"
          ? JSON.parse(order.productsJson)
          : order.productsJson;
      return Array.isArray(arr) ? arr : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  return [];
};

const OrdersAdmin = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersPage, setOrdersPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const orderIdentifier = useCallback(
    (order) => order?.id ?? order?.orderId ?? order?._id ?? null,
    []
  );

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    setOrdersLoading(true);
    try {
      const data = await getOrdersService(token);
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at);
            const dateB = new Date(b.createdAt || b.created_at);
            return dateB - dateA;
          })
        : [];
      setOrders(sorted);
    } catch (error) {
      console.error(error);
      alert("Error cargando órdenes");
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchOrders();
  }, [token, fetchOrders]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(orders.length / ordersPageSize));
    if (ordersPage > totalPages) {
      setOrdersPage(totalPages);
    }
  }, [orders, ordersPage]);

  const pagedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ordersPageSize;
    return orders.slice(start, start + ordersPageSize);
  }, [orders, ordersPage]);

  const [orderProductsModal, setOrderProductsModal] = useState({
    open: false,
    items: [],
    orderId: null,
  });

  const openOrderProducts = (order) => {
    setOrderProductsModal({
      open: true,
      items: parseOrderItems(order),
      orderId: order?.id ?? order?.orderId ?? null,
    });
  };

  const closeOrderProducts = () =>
    setOrderProductsModal((prev) => ({ ...prev, open: false }));

  const getItemName = (item) =>
    item?.productName ?? `Producto ${item?.product_id ?? ""}`;

  const getItemQty = (item) =>
    Number(item?.quantity ?? item?.qty ?? item?.amount ?? item?.count ?? 1);

  const getItemPrice = (item) =>
    Number(
      item?.price ??
        item?.unit_price ??
        item?.unitPrice ??
        item?.product?.price ??
        0
    );

  const getItemSubtotal = (item) =>
    Number(item?.subtotal ?? getItemQty(item) * getItemPrice(item));

  const ordersTotalPages = Math.max(
    1,
    Math.ceil(orders.length / ordersPageSize)
  );

  const getProductCount = useCallback(
    (order) => parseOrderItems(order).length,
    []
  );

  const handleOrderStatusChange = useCallback(
    async (order, nextStatus) => {
      if (!token) return;

      const id = orderIdentifier(order);
      if (!id) return;

      setUpdatingOrderId(id);

      try {
        const updated = await updateOrderStatusService(token, id, nextStatus);
        setOrders((prev) =>
          prev.map((item) => {
            const currentId = orderIdentifier(item);
            if (currentId !== id) return item;

            const payload =
              updated && typeof updated === "object" ? updated : {};
            const status = payload.status ?? nextStatus ?? item.status;

            return { ...item, ...payload, status };
          })
        );
      } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el estado de la orden");
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [token, orderIdentifier]
  );

  return (
    <>
      <OrderProductsModal
        isOpen={orderProductsModal.open}
        items={orderProductsModal.items}
        onClose={closeOrderProducts}
        getItemName={getItemName}
        getItemQty={getItemQty}
        getItemPrice={getItemPrice}
        getItemSubtotal={getItemSubtotal}
      />

      <OrdersTab
        orders={orders}
        pagedOrders={pagedOrders}
        loading={ordersLoading}
        currentPage={ordersPage}
        totalPages={ordersTotalPages}
        pageSize={ordersPageSize}
        onPageChange={setOrdersPage}
        onOpenProducts={openOrderProducts}
        getProductCount={getProductCount}
        onUpdateStatus={handleOrderStatusChange}
        updatingOrderId={updatingOrderId}
        statusOptions={ORDER_STATUS_OPTIONS}
      />
    </>
  );
};

export default OrdersAdmin;
