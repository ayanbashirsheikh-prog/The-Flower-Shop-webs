import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view this order.");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load order."
        );
      }

      setOrder(data.order);
    } catch (error) {
      console.error("ORDER DETAILS ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f7] px-4 py-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-12 w-64 animate-pulse rounded-xl bg-white" />
          <div className="h-80 animate-pulse rounded-[2rem] bg-white" />
          <div className="h-60 animate-pulse rounded-[2rem] bg-white" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f7] px-4">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <XCircle
            size={45}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-5 text-2xl font-semibold">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "This order could not be found."}
          </p>

          <Link
            to="/my-orders"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled";

  return (
    <main className="min-h-screen bg-[#faf8f7] px-4 py-12 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          to="/my-orders"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-pink-600"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
              Order Details
            </p>

            <h1 className="mt-2 font-serif text-4xl text-slate-900">
              #{String(order._id).slice(-8).toUpperCase()}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div
            className={`w-fit rounded-full px-5 py-2 text-sm font-semibold ${
              isCancelled
                ? "bg-red-50 text-red-600"
                : "bg-pink-50 text-pink-600"
            }`}
          >
            {order.status}
          </div>

        </div>

        {/* TRACKING */}

        <section className="mb-6 rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.05)] sm:p-8">

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-pink-50 p-3">
              <Truck
                size={22}
                className="text-pink-500"
              />
            </div>

            <div>
              <h2 className="font-serif text-2xl">
                Delivery Status
              </h2>

              <p className="text-sm text-slate-500">
                Track your flowers from our shop to your door.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Tracking status={order.status} />
          </div>

        </section>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* PRODUCTS */}

          <section className="rounded-[2rem] bg-white p-6 shadow-sm lg:col-span-2">

            <div className="flex items-center gap-3">
              <Package
                size={20}
                className="text-pink-500"
              />

              <h2 className="font-serif text-2xl">
                Your Flowers
              </h2>
            </div>

            <div className="mt-6 divide-y divide-slate-100">

              {(order.items || []).map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package
                          size={25}
                          className="text-slate-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 justify-between gap-4">

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm text-pink-600">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <p className="font-semibold text-slate-800">
                      ₹
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* SUMMARY */}

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">

            <h2 className="font-serif text-2xl">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">

              <SummaryRow
                label="Subtotal"
                value={order.subtotal}
              />

              <SummaryRow
                label="Delivery"
                value={order.deliveryFee}
              />

              <div className="border-t border-slate-100 pt-4">
                <SummaryRow
                  label="Total"
                  value={order.totalPrice}
                  total
                />
              </div>

            </div>

            {/* PAYMENT */}

            <div className="mt-7 rounded-2xl bg-slate-50 p-4">

              <div className="flex items-center gap-3">
                <CreditCard
                  size={18}
                  className="text-pink-500"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">

                <span className="text-xs text-slate-400">
                  Payment Status
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {order.paymentStatus}
                </span>

              </div>

            </div>

          </section>

        </div>

        {/* ADDRESS */}

        <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-pink-50 p-3">
              <MapPin
                size={21}
                className="text-pink-500"
              />
            </div>

            <div>
              <h2 className="font-serif text-2xl">
                Delivery Address
              </h2>

              <p className="text-sm text-slate-500">
                Your flowers will be delivered here.
              </p>
            </div>
          </div>

          {order.address && (
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <p className="font-semibold text-slate-800">
                {order.address.fullName}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {order.address.addressLine}
                <br />
                {order.address.city},{" "}
                {order.address.state}
                <br />
                {order.address.pincode}
              </p>

              <p className="mt-3 text-sm font-medium text-slate-700">
                Phone: {order.address.phone}
              </p>

            </div>
          )}

        </section>

        {/* GIFT MESSAGE */}

        {order.giftMessage && (
          <section className="mt-6 rounded-[2rem] border border-pink-100 bg-pink-50/50 p-6">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
              Gift Message
            </p>

            <p className="mt-3 font-serif text-xl italic text-slate-700">
              “{order.giftMessage}”
            </p>

          </section>
        )}

      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  total = false,
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        total ? "text-lg" : ""
      }`}
    >
      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={
          total
            ? "font-bold text-pink-600"
            : "font-medium text-slate-700"
        }
      >
        ₹{Number(value || 0).toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function Tracking({ status }) {
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

  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-red-50 p-5 text-red-600">
        <XCircle size={25} />

        <div>
          <p className="font-semibold">
            Order Cancelled
          </p>

          <p className="mt-1 text-sm text-red-500">
            This order has been cancelled.
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
    <div className="overflow-x-auto">
      <div className="flex min-w-[650px] items-start">

        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = index <= currentIndex;

          return (
            <div
              key={step.name}
              className="flex flex-1 items-start"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    active
                      ? "border-pink-500 bg-pink-500 text-white"
                      : "border-slate-200 bg-white text-slate-300"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <p
                  className={`mt-3 text-xs font-semibold ${
                    active
                      ? "text-pink-600"
                      : "text-slate-400"
                  }`}
                >
                  {step.name}
                </p>

              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`mt-6 h-0.5 flex-1 ${
                    index < currentIndex
                      ? "bg-pink-500"
                      : "bg-slate-200"
                  }`}
                />
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}