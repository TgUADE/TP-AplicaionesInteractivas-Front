import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import OrdersTab from "../../components/Admin/tabs/OrdersTab";
import OrderProductsModal from "../../components/Admin/modals/Orders/OrderProductsModal";
import Toast from "../../components/UI/Toast";
import useToast from "../../hooks/useToast";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "../../redux/slices/Admin/adminOrdersSlice";

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
  const dispatch = useDispatch();
  const { toast, showToast, dismissToast } = useToast();

  const {
    items: orders = [],
    loading: ordersLoading = false,
    error: ordersError = null,
    mutationStatus = "idle",
    mutationError = null,
  } = useSelector((state) => state.adminOrders) ?? {};

  const [ordersPage, setOrdersPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const orderIdentifier = useCallback(
    (order) => order?.id ?? order?.orderId ?? order?._id ?? null,
    []
  );

  useEffect(() => {
    dispatch(fetchAdminOrders()).catch((error) => {
      console.error("Error cargando órdenes", error);
      showToast(
        error?.message || "No se pudieron cargar las órdenes.",
        "error"
      );
    });
  }, [dispatch, showToast]);

  useEffect(() => {
    if (ordersError) {
      showToast(ordersError, "error");
    }
  }, [ordersError, showToast]);

  useEffect(() => {
    if (mutationStatus === "failed" && mutationError) {
      showToast(mutationError, "error");
    }
  }, [mutationStatus, mutationError, showToast]);

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
      const id = orderIdentifier(order);
      if (!id) return;

      setUpdatingOrderId(id);

      try {
        await dispatch(
          updateAdminOrderStatus({
            orderId: id,
            status: nextStatus,
          })
        );
        showToast("Estado de la orden actualizado.", "success");
      } catch (error) {
        console.error(error);
        showToast(
          error?.message || "No se pudo actualizar el estado de la orden.",
          "error"
        );
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [dispatch, orderIdentifier, showToast]
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
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
};

export default OrdersAdmin;
