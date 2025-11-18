import Button from "../../UI/Button";

const OrdersTab = ({
  orders,
  pagedOrders,
  loading,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onOpenProducts,
  getProductCount,
  onUpdateStatus,
  updatingOrderId,
  statusOptions = [],
}) => {
  const handlePrev = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const from = orders.length ? (currentPage - 1) * pageSize + 1 : 0;
  const to = Math.min(orders.length, currentPage * pageSize);

  const statusStyles = {
    PENDING: "bg-amber-100 border-amber-300 text-amber-800",
    SHIPPED: "bg-green-100 border-green-300 text-green-800",
    CANCELLED: "bg-gray-100 border-gray-300 text-gray-600",
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "-";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-gray-500">List of all orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border">
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Billing Address</th>
                  <th className="px-4 py-3">Shipping Address</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((o) => {
                  const orderId = o.id ?? o.orderId ?? o._id;
                  const isUpdating = updatingOrderId === orderId;

                  const selectValue = (() => {
                    const raw = (o.status ?? "").toString();
                    const upperRaw = raw.toUpperCase();

                    const match = statusOptions.find(
                      (option) =>
                        option.value.toUpperCase() === upperRaw ||
                        option.label.toUpperCase() === upperRaw
                    );

                    return match ? match.value : "__custom__";
                  })();

                  const appliedStatusClass =
                    statusStyles[selectValue] ?? "bg-white border-gray-300";

                  const handleStatusChange = (event) => {
                    const next = event.target.value;
                    if (next === "__custom__") return;
                    if (typeof onUpdateStatus === "function") {
                      onUpdateStatus(o, next);
                    }
                  };

                  return (
                    <tr key={orderId} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        {o.user?.email ?? o.customerEmail ?? o.email ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {o.totalAmount ?? o.total ?? o.amount ?? "-"}
                      </td>
                      <td className="px-4 py-3">{o.paymentMethod ?? "-"}</td>
                      <td className="px-4 py-3">
                        {typeof onUpdateStatus === "function" &&
                        statusOptions.length > 0 ? (
                          <select
                            value={selectValue}
                            onChange={handleStatusChange}
                            disabled={isUpdating}
                            className={`w-full rounded-md border px-2 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${appliedStatusClass}`}
                          >
                            {selectValue === "__custom__" && (
                              <option value="__custom__" disabled>
                                {o.status ?? "-"}
                              </option>
                            )}
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          o.status ?? "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onOpenProducts(o)}
                          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                          title="View products of the order"
                        >
                          <span className="inline-block">▶</span>
                          <span>
                            {(() => {
                              const count =
                                typeof getProductCount === "function"
                                  ? getProductCount(o)
                                  : o.products?.length ??
                                    o.items?.length ??
                                    o.orderItems?.length ??
                                    (Array.isArray(o.productsJson)
                                      ? o.productsJson.length
                                      : 0);
                              return count > 0 ? count : "-";
                            })()}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {o.billing_address ?? o.billingAddress ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {o.shipping_address ?? o.shippingAddress ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(o.createdAt || o.created_at)}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td className="px-4 py-6" colSpan={8}>
                      No orders
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={8}>
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="text-sm text-gray-600">
                        {orders.length > 0 ? (
                          <>
                            Showing <span className="font-medium">{from}</span>
                            {" - "}
                            <span className="font-medium">{to}</span>
                            {" of "}
                            <span className="font-medium">{orders.length}</span>
                          </>
                        ) : (
                          "No orders"
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={handlePrev}
                          disabled={currentPage === 1}
                          className="h-9 px-3"
                        >
                          Previous
                        </Button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((n) => (
                          <button
                            key={n}
                            onClick={() => onPageChange(n)}
                            className={`h-9 min-w-9 px-3 rounded-md border text-sm ${
                              n === currentPage
                                ? "bg-black text-white border-black"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            {n}
                          </button>
                        ))}

                        <Button
                          variant="outline"
                          onClick={handleNext}
                          disabled={currentPage === totalPages}
                          className="h-9 px-3"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
