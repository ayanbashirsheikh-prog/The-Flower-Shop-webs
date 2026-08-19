import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  Search,
  Package,
  ShoppingBag,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  Trash2,
  X,
  MapPin,
  CalendarDays,
  CreditCard,
  User,
  Phone,
  Mail,
  ChevronDown,
  RefreshCw,
  Receipt,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/orders";

const ORDER_STATUSES = [
  "Ordered",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

const statusStyles = {
  Ordered:
    "bg-amber-50 text-amber-700 border-amber-200",

  Confirmed:
    "bg-blue-50 text-blue-700 border-blue-200",

  Processing:
    "bg-purple-50 text-purple-700 border-purple-200",

  Shipped:
    "bg-indigo-50 text-indigo-700 border-indigo-200",

  Delivered:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  Cancelled:
    "bg-red-50 text-red-700 border-red-200",
};

const paymentStyles = {
  Pending:
    "bg-amber-50 text-amber-700 border-amber-200",

  Paid:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  Failed:
    "bg-red-50 text-red-700 border-red-200",

  Refunded:
    "bg-purple-50 text-purple-700 border-purple-200",
};

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState("All");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [updatingId, setUpdatingId] =
    useState(null);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token =
        localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const res = await axios.get(
        `${API_URL}/admin/all`,
        config
      );

      if (res.data?.success) {
        setOrders(
          Array.isArray(res.data.orders)
            ? res.data.orders
            : []
        );
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const totalRevenue = orders
      .filter(
        (order) =>
          order.status !== "Cancelled"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.totalPrice || 0),
        0
      );

    const pendingOrders = orders.filter(
      (order) =>
        order.status === "Ordered" ||
        order.status === "Confirmed" ||
        order.status === "Processing"
    ).length;

    const deliveredOrders = orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    };
  }, [orders]);

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderNumber =
        order.orderNumber
          ?.toLowerCase() || "";

      const customerName =
        order.address?.fullName
          ?.toLowerCase() || "";

      const phone =
        order.address?.phone
          ?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        orderNumber.includes(query) ||
        customerName.includes(query) ||
        phone.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        order.paymentStatus ===
          paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);

      const token =
        localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const res = await axios.patch(
        `${API_URL}/admin/${orderId}/status`,
        {
          status,
        },
        config
      );

      if (res.data?.success) {
        toast.success(
          `Order marked as ${status}`
        );

        setOrders((current) =>
          current.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status,
                }
              : order
          )
        );

        setSelectedOrder((current) =>
          current?._id === orderId
            ? {
                ...current,
                status,
              }
            : current
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // UPDATE PAYMENT STATUS
  // =====================================================

  const updatePaymentStatus = async (
    orderId,
    paymentStatus
  ) => {
    try {
      setUpdatingId(orderId);

      const token =
        localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const res = await axios.patch(
        `${API_URL}/admin/${orderId}/payment`,
        {
          paymentStatus,
        },
        config
      );

      if (res.data?.success) {
        toast.success(
          `Payment marked as ${paymentStatus}`
        );

        setOrders((current) =>
          current.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  paymentStatus,
                }
              : order
          )
        );

        setSelectedOrder((current) =>
          current?._id === orderId
            ? {
                ...current,
                paymentStatus,
              }
            : current
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update payment"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this order?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(orderId);

      const token =
        localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const res = await axios.delete(
        `${API_URL}/admin/${orderId}`,
        config
      );

      if (res.data?.success) {
        toast.success(
          "Order deleted successfully"
        );

        setOrders((current) =>
          current.filter(
            (order) =>
              order._id !== orderId
          )
        );

        if (
          selectedOrder?._id === orderId
        ) {
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="h-12 w-72 animate-pulse rounded-2xl bg-gray-200" />
            <div className="mt-4 h-5 w-96 animate-pulse rounded-xl bg-gray-200" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-5 md:p-8 lg:p-10">

      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
        >
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
              The Flower Shop
            </p>

            <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
              Orders
            </h1>

            <p className="mt-3 max-w-xl text-gray-500">
              Manage customer orders,
              payments and deliveries
              from one beautiful dashboard.
            </p>
          </div>

          <button
            onClick={() =>
              fetchOrders(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:border-pink-300 hover:text-pink-600 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Orders"}
          </button>
        </motion.div>

        {/* ================================================= */}
        {/* STAT CARDS */}
        {/* ================================================= */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            description="All customer orders"
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(
              stats.totalRevenue
            )}
            icon={IndianRupee}
            description="Excluding cancelled orders"
          />

          <StatCard
            title="Pending"
            value={stats.pendingOrders}
            icon={Clock3}
            description="Orders in progress"
          />

          <StatCard
            title="Delivered"
            value={stats.deliveredOrders}
            icon={CheckCircle2}
            description="Successfully delivered"
          />

        </div>

        {/* ================================================= */}
        {/* FILTER BAR */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mt-8 rounded-3xl border border-white bg-white/90 p-4 shadow-lg shadow-pink-100/40 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 xl:flex-row">

            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search order number, customer or phone..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
              />
            </div>

            {/* Status */}

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 pr-11 font-medium outline-none focus:border-pink-400 focus:bg-white md:min-w-52"
              >
                <option value="All">
                  All Order Status
                </option>

                {ORDER_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Payment */}

            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(
                    e.target.value
                  )
                }
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 pr-11 font-medium outline-none focus:border-pink-400 focus:bg-white md:min-w-52"
              >
                <option value="All">
                  All Payments
                </option>

                {PAYMENT_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

          </div>
        </motion.div>

        {/* ================================================= */}
        {/* RESULT COUNT */}
        {/* ================================================= */}

        <div className="my-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">
              {orders.length}
            </span>{" "}
            orders
          </p>
        </div>

        {/* ================================================= */}
        {/* ORDERS */}
        {/* ================================================= */}

        {filteredOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-5">

            {filteredOrders.map(
              (order, index) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={index}
                  updatingId={updatingId}
                  onView={() =>
                    setSelectedOrder(
                      order
                    )
                  }
                  onStatusChange={
                    updateOrderStatus
                  }
                  onPaymentChange={
                    updatePaymentStatus
                  }
                  onDelete={
                    deleteOrder
                  }
                />
              )
            )}

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ================================================= */}

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            updatingId={updatingId}
            onClose={() =>
              setSelectedOrder(null)
            }
            onStatusChange={
              updateOrderStatus
            }
            onPaymentChange={
              updatePaymentStatus
            }
            onDelete={deleteOrder}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="rounded-3xl border border-white bg-white/90 p-6 shadow-lg shadow-pink-100/40"
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-black text-gray-900">
            {value}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-3 text-white shadow-lg shadow-pink-200">
          <Icon size={22} />
        </div>

      </div>
    </motion.div>
  );
}

// =====================================================
// ORDER CARD
// =====================================================

function OrderCard({
  order,
  index,
  updatingId,
  onView,
  onStatusChange,
  onPaymentChange,
  onDelete,
}) {
  const firstProduct =
    order.products?.[0];

  const extraProducts =
    Math.max(
      0,
      (order.products?.length || 0) -
        1
    );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.04,
      }}
      className="overflow-hidden rounded-3xl border border-white bg-white shadow-lg shadow-gray-100/70"
    >

      <div className="p-5 md:p-6">

        <div className="flex flex-col gap-6 xl:flex-row xl:items-center">

          {/* Product */}

          <div className="flex min-w-0 flex-1 items-center gap-4">

            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-pink-50">
              {firstProduct?.image ? (
                <img
                  src={
                    firstProduct.image.startsWith(
                      "http"
                    )
                      ? firstProduct.image
                      : `http://localhost:5000${firstProduct.image}`
                  }
                  alt={
                    firstProduct.name ||
                    "Product"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">
                  🌸
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-bold text-gray-900">
                  {firstProduct?.name ||
                    "Flower Product"}
                </h3>

                {extraProducts > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                    +{extraProducts} more
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-gray-400">
                {order.orderNumber ||
                  order._id}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>

          </div>

          {/* Customer */}

          <div className="min-w-44">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Customer
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {order.address
                ?.fullName ||
                "Guest Customer"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {order.address?.phone ||
                "No phone"}
            </p>
          </div>

          {/* Amount */}

          <div className="min-w-32">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total
            </p>

            <p className="mt-1 text-xl font-black text-gray-900">
              {formatCurrency(
                order.totalPrice
              )}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {order.products?.length ||
                0}{" "}
              item(s)
            </p>
          </div>

          {/* Status */}

          <div className="min-w-40">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Status
            </p>

            <select
              value={order.status}
              disabled={
                updatingId === order._id
              }
              onChange={(e) =>
                onStatusChange(
                  order._id,
                  e.target.value
                )
              }
              className={`w-full rounded-xl border px-3 py-2 text-sm font-bold outline-none ${
                statusStyles[
                  order.status
                ] || ""
              }`}
            >
              {ORDER_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Actions */}

          <div className="flex items-center gap-2">

            <button
              onClick={onView}
              className="rounded-xl border border-gray-200 bg-white p-3 text-gray-600 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"
              title="View Order"
            >
              <Eye size={19} />
            </button>

            <button
              onClick={() =>
                onDelete(order._id)
              }
              disabled={
                updatingId === order._id
              }
              className="rounded-xl border border-red-100 bg-red-50 p-3 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
              title="Delete Order"
            >
              <Trash2 size={19} />
            </button>

          </div>

        </div>

      </div>

      {/* Bottom strip */}

      <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-3 md:flex-row md:items-center md:justify-between">

        <div className="flex flex-wrap items-center gap-3">

          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${
              paymentStyles[
                order.paymentStatus
              ] || ""
            }`}
          >
            💳{" "}
            {order.paymentStatus ||
              "Pending"}
          </span>

          <span className="text-xs text-gray-400">
            {order.paymentMethod ||
              "Payment"}
          </span>

        </div>

        <p className="text-xs text-gray-400">
          Delivery:{" "}
          <span className="font-semibold text-gray-600">
            {order.deliveryDate
              ? formatDate(
                  order.deliveryDate
                )
              : "Not scheduled"}
          </span>
        </p>

      </div>

    </motion.div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyOrders() {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center shadow-sm">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-500">
        <Package size={36} />
      </div>

      <h2 className="mt-6 text-2xl font-black text-gray-900">
        No Orders Found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-gray-500">
        There are no orders matching
        your current search or filters.
      </p>

    </div>
  );
}

// =====================================================
// ORDER DETAILS MODAL
// =====================================================

function OrderDetailsModal({
  order,
  updatingId,
  onClose,
  onStatusChange,
  onPaymentChange,
  onDelete,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-white shadow-2xl"
      >

        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-5 backdrop-blur-xl md:px-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">
              Order Details
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-900">
              {order.orderNumber ||
                order._id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
          >
            <X size={20} />
          </button>

        </div>

        <div className="space-y-8 p-6 md:p-8">

          {/* Customer + Delivery */}

          <div className="grid gap-5 lg:grid-cols-2">

            <InfoSection
              title="Customer"
              icon={User}
            >
              <InfoRow
                icon={User}
                text={
                  order.address
                    ?.fullName ||
                  "N/A"
                }
              />

              <InfoRow
                icon={Phone}
                text={
                  order.address
                    ?.phone || "N/A"
                }
              />

              <InfoRow
                icon={Mail}
                text={
                  order.address
                    ?.email || "N/A"
                }
              />
            </InfoSection>

            <InfoSection
              title="Delivery Address"
              icon={MapPin}
            >
              <p className="leading-6 text-gray-600">
                {
                  order.address
                    ?.addressLine
                }
                <br />

                {
                  order.address
                    ?.city
                }

                {order.address
                  ?.state &&
                  `, ${order.address.state}`}

                <br />

                PIN:{" "}
                {
                  order.address
                    ?.pincode
                }

                {order.address
                  ?.landmark && (
                  <>
                    <br />
                    Landmark:{" "}
                    {
                      order.address
                        .landmark
                    }
                  </>
                )}
              </p>
            </InfoSection>

          </div>

          {/* Delivery Schedule */}

          <div className="rounded-3xl bg-gradient-to-r from-pink-50 to-rose-50 p-5">

            <div className="flex flex-wrap gap-6">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 text-pink-500 shadow-sm">
                  <CalendarDays
                    size={20}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    Delivery Date
                  </p>

                  <p className="font-bold text-gray-900">
                    {order.deliveryDate
                      ? formatDate(
                          order.deliveryDate
                        )
                      : "Not scheduled"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 text-pink-500 shadow-sm">
                  <Truck size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    Delivery Time
                  </p>

                  <p className="font-bold text-gray-900">
                    {order.deliveryTime ||
                      "Flexible"}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Products */}

          <div>
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBag
                size={20}
                className="text-pink-500"
              />

              <h3 className="text-xl font-black text-gray-900">
                Products
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100">

              {order.products?.map(
                (product, index) => (
                  <div
                    key={
                      product.productId ||
                      index
                    }
                    className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-0"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-pink-50">
                      {product.image ? (
                        <img
                          src={
                            product.image.startsWith(
                              "http"
                            )
                              ? product.image
                              : `http://localhost:5000${product.image}`
                          }
                          alt={
                            product.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">
                          🌸
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatCurrency(
                          product.price
                        )}{" "}
                        ×{" "}
                        {
                          product.quantity
                        }
                      </p>
                    </div>

                    <p className="font-black text-gray-900">
                      {formatCurrency(
                        product.subtotal
                      )}
                    </p>
                  </div>
                )
              )}

            </div>
          </div>

          {/* Gift Message */}

          {order.giftMessage && (
            <div className="rounded-3xl border border-pink-100 bg-pink-50/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-pink-500">
                🎁 Gift Message
              </p>

              <p className="mt-3 text-gray-700">
                “{order.giftMessage}”
              </p>
            </div>
          )}

          {/* Payment + Status */}

          <div className="grid gap-5 lg:grid-cols-2">

            <InfoSection
              title="Order Status"
              icon={Truck}
            >
              <select
                value={order.status}
                disabled={
                  updatingId ===
                  order._id
                }
                onChange={(e) =>
                  onStatusChange(
                    order._id,
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold outline-none focus:border-pink-400"
              >
                {ORDER_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </InfoSection>

            <InfoSection
              title="Payment"
              icon={CreditCard}
            >
              <div className="flex gap-3">

                <select
                  value={
                    order.paymentStatus
                  }
                  disabled={
                    updatingId ===
                    order._id
                  }
                  onChange={(e) =>
                    onPaymentChange(
                      order._id,
                      e.target.value
                    )
                  }
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold outline-none focus:border-pink-400"
                >
                  {PAYMENT_STATUSES.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

              </div>

              <p className="mt-3 text-sm text-gray-500">
                Method:{" "}
                <span className="font-bold text-gray-800">
                  {order.paymentMethod ||
                    "N/A"}
                </span>
              </p>

              {order.transactionId && (
                <p className="mt-1 break-all text-xs text-gray-400">
                  Transaction:{" "}
                  {
                    order.transactionId
                  }
                </p>
              )}
            </InfoSection>

          </div>

          {/* Price Summary */}

          <div className="rounded-3xl bg-gray-950 p-6 text-white md:p-7">

            <div className="mb-5 flex items-center gap-2">
              <Receipt
                size={20}
                className="text-pink-400"
              />

              <h3 className="font-bold">
                Payment Summary
              </h3>
            </div>

            <div className="space-y-3 text-sm">

              <SummaryRow
                label="Subtotal"
                value={formatCurrency(
                  order.subtotal
                )}
              />

              <SummaryRow
                label="Delivery"
                value={
                  order.deliveryFee ===
                  0
                    ? "FREE"
                    : formatCurrency(
                        order.deliveryFee
                      )
                }
              />

              {order.discount >
                0 && (
                <SummaryRow
                  label={`Discount ${
                    order.couponCode
                      ? `(${order.couponCode})`
                      : ""
                  }`}
                  value={`-${formatCurrency(
                    order.discount
                  )}`}
                />
              )}

              <div className="my-4 border-t border-white/10" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  Grand Total
                </span>

                <span className="text-2xl font-black text-pink-400">
                  {formatCurrency(
                    order.totalPrice
                  )}
                </span>
              </div>

            </div>

          </div>

          {/* Created */}

          <p className="text-center text-xs text-gray-400">
            Order created on{" "}
            {formatDateTime(
              order.createdAt
            )}
          </p>

          {/* Delete */}

          <button
            onClick={() =>
              onDelete(order._id)
            }
            disabled={
              updatingId === order._id
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-4 font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 size={18} />
            Delete Order
          </button>

        </div>

      </motion.div>
    </motion.div>
  );
}

// =====================================================
// INFO SECTION
// =====================================================

function InfoSection({
  title,
  icon: Icon,
  children,
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-5">

      <div className="mb-4 flex items-center gap-2">
        <Icon
          size={18}
          className="text-pink-500"
        />

        <h3 className="font-black text-gray-900">
          {title}
        </h3>
      </div>

      {children}

    </div>
  );
}

// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
  icon: Icon,
  text,
}) {
  return (
    <div className="mb-3 flex items-center gap-3 last:mb-0">
      <Icon
        size={16}
        className="text-gray-400"
      />

      <span className="break-all text-sm text-gray-600">
        {text}
      </span>
    </div>
  );
}

// =====================================================
// SUMMARY ROW
// =====================================================

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between text-gray-300">
      <span>{label}</span>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}