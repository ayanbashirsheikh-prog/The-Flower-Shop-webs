import {
  Package,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders.");
        return;
      }

      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("ORDERS ERROR:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
            My Account
          </p>

          <h1 className="mt-2 font-serif text-4xl text-slate-900 sm:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Follow your beautiful blooms from preparation to delivery.
          </p>
        </motion.div>

        {/* LOADING */}

        {loading && (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-[2rem] bg-white"
              />
            ))}
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-sm">
            <XCircle
              size={42}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Unable to load orders
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={fetchOrders}
              className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50">
              <ShoppingBag
                size={34}
                className="text-pink-500"
                strokeWidth={1.5}
              />
            </div>

            <h2 className="mt-6 font-serif text-3xl text-slate-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Your beautiful flower arrangements will appear here
              once you place your first order.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-pink-600"
            >
              Explore Flowers
            </Link>
          </motion.div>
        )}

        {/* ORDERS */}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order, index) => (
              <OrderCard
                key={order._id || index}
                order={order}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

function OrderCard({ order }) {
  const status = order.status || "Ordered";

  const statusInfo = getStatusInfo(status);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]"
    >

      {/* TOP */}

      <div className="flex flex-col gap-5 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50">
            <Package
              size={22}
              className="text-pink-500"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Order
            </p>

            <h2 className="mt-1 font-mono text-sm font-semibold text-slate-800">
              #{String(order._id || "").slice(-8).toUpperCase()}
            </h2>
          </div>

        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${statusInfo.className}`}
        >
          <statusInfo.icon size={14} />
          {status}
        </div>

      </div>

      {/* PRODUCTS */}

      <div className="p-6">

        <div className="flex gap-3 overflow-x-auto pb-2">

          {(order.items || []).slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package
                    size={22}
                    className="text-slate-400"
                  />
                </div>
              )}

              <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                ×{item.quantity}
              </span>
            </div>
          ))}

        </div>

        {/* INFO */}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <Info
            icon={CreditCard}
            label="Payment"
            value={order.paymentMethod || "COD"}
          />

          <Info
            icon={MapPin}
            label="Delivery"
            value={
              order.address?.city ||
              "Address available"
            }
          />

          <Info
            icon={ShoppingBag}
            label="Total"
            value={`₹${Number(order.totalPrice || 0).toLocaleString("en-IN")}`}
            highlight
          />

        </div>

        {/* STATUS */}

        <div className="mt-7">
          <OrderProgress status={status} />
        </div>

        {/* FOOTER */}

        <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs text-slate-400">
              Ordered on
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(order.createdAt)}
            </p>
          </div>

          <Link
            to={`/orders/${order._id}`}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
          >
            View Details
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>

    </motion.article>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="rounded-xl bg-white p-2.5 shadow-sm">
        <Icon
          size={17}
          className={
            highlight
              ? "text-pink-500"
              : "text-slate-500"
          }
        />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-sm font-semibold ${
            highlight
              ? "text-pink-600"
              : "text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function OrderProgress({ status }) {
  const steps = [
    {
      name: "Ordered",
      icon: Clock3,
    },
    {
      name: "Confirmed",
      icon: CheckCircle2,
    },
    {
      name: "Processing",
      icon: Package,
    },
    {
      name: "Shipped",
      icon: Truck,
    },
    {
      name: "Delivered",
      icon: CheckCircle2,
    },
  ];

  const cancelled = status === "Cancelled";

  if (cancelled) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-600">
        <XCircle size={20} />

        <div>
          <p className="text-sm font-semibold">
            Order Cancelled
          </p>

          <p className="mt-0.5 text-xs text-red-500">
            This order is no longer being processed.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.name === status)
  );

  return (
    <div className="flex items-center">

      {steps.map((step, index) => {
        const Icon = step.icon;
        const completed = index <= currentIndex;

        return (
          <div
            key={step.name}
            className="flex flex-1 items-center"
          >

            <div className="flex flex-col items-center">

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                  completed
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-slate-200 bg-white text-slate-300"
                }`}
              >
                <Icon size={15} />
              </div>

              <span
                className={`mt-2 hidden text-[10px] font-medium sm:block ${
                  completed
                    ? "text-pink-600"
                    : "text-slate-400"
                }`}
              >
                {step.name}
              </span>

            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  index < currentIndex
                    ? "bg-pink-400"
                    : "bg-slate-100"
                }`}
              />
            )}

          </div>
        );
      })}

    </div>
  );
}

function getStatusInfo(status) {
  switch (status) {
    case "Confirmed":
      return {
        icon: CheckCircle2,
        className: "bg-blue-50 text-blue-600",
      };

    case "Processing":
      return {
        icon: Package,
        className: "bg-amber-50 text-amber-600",
      };

    case "Shipped":
      return {
        icon: Truck,
        className: "bg-purple-50 text-purple-600",
      };

    case "Delivered":
      return {
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-600",
      };

    case "Cancelled":
      return {
        icon: XCircle,
        className: "bg-red-50 text-red-600",
      };

    default:
      return {
        icon: Clock3,
        className: "bg-slate-100 text-slate-600",
      };
  }
}

function formatDate(date) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}