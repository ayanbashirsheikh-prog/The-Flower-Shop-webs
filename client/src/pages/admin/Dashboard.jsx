import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
  Clock3,
  Truck,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹1,24,580",
    change: "+18.4%",
    positive: true,
    icon: IndianRupee,
  },
  {
    title: "Total Orders",
    value: "348",
    change: "+12.8%",
    positive: true,
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    value: "1,284",
    change: "+8.2%",
    positive: true,
    icon: Users,
  },
  {
    title: "Products",
    value: "126",
    change: "-2.4%",
    positive: false,
    icon: Package,
  },
];

const recentOrders = [
  {
    id: "#TFS-1048",
    customer: "Priya Sharma",
    product: "Luxury Rose Bouquet",
    amount: "₹2,499",
    status: "Delivered",
  },
  {
    id: "#TFS-1047",
    customer: "Rahul Mehta",
    product: "Pink Peony Collection",
    amount: "₹3,199",
    status: "Processing",
  },
  {
    id: "#TFS-1046",
    customer: "Sneha Patel",
    product: "Premium Red Roses",
    amount: "₹1,899",
    status: "Shipped",
  },
  {
    id: "#TFS-1045",
    customer: "Arjun Kapoor",
    product: "White Lily Bouquet",
    amount: "₹2,299",
    status: "Confirmed",
  },
];

const topProducts = [
  {
    name: "Luxury Rose Bouquet",
    category: "Roses",
    sold: 84,
    revenue: "₹2,09,916",
  },
  {
    name: "Pink Peony Collection",
    category: "Peonies",
    sold: 62,
    revenue: "₹1,98,338",
  },
  {
    name: "Premium Red Roses",
    category: "Roses",
    sold: 57,
    revenue: "₹1,08,243",
  },
  {
    name: "White Lily Bouquet",
    category: "Lilies",
    sold: 43,
    revenue: "₹98,857",
  },
];

function StatusBadge({ status }) {
  const styles = {
    Delivered:
      "bg-emerald-50 text-emerald-600 border-emerald-100",
    Processing:
      "bg-amber-50 text-amber-600 border-amber-100",
    Shipped:
      "bg-blue-50 text-blue-600 border-blue-100",
    Confirmed:
      "bg-violet-50 text-violet-600 border-violet-100",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        border px-3 py-1
        text-xs font-semibold
        ${styles[status] || "bg-slate-50 text-slate-600"}
      `}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-500">
            Overview
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Good evening, Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening with your flower store today.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            className="
              rounded-xl border border-slate-200
              bg-white px-4 py-2.5
              text-sm font-semibold text-slate-700
              shadow-sm transition
              hover:border-pink-200
              hover:bg-pink-50
              hover:text-pink-600
            "
          >
            Last 30 days
          </button>

          <button
            type="button"
            className="
              rounded-xl bg-slate-900
              px-4 py-2.5
              text-sm font-semibold text-white
              shadow-lg shadow-slate-200
              transition hover:bg-pink-600
              hover:shadow-pink-200
            "
          >
            Export Report
          </button>

        </div>

      </section>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                group rounded-2xl
                border border-slate-200
                bg-white p-5
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-xl
                    bg-pink-50
                    text-pink-600
                    transition
                    group-hover:bg-pink-500
                    group-hover:text-white
                  "
                >
                  <Icon size={21} />
                </div>

                <div
                  className={`
                    flex items-center gap-1
                    rounded-full px-2.5 py-1
                    text-xs font-bold
                    ${
                      stat.positive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }
                  `}
                >
                  {stat.positive ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}

                  {stat.change}
                </div>

              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Compared with previous period
              </p>

            </div>
          );
        })}

      </section>

      {/* =====================================================
          REVENUE + ORDER STATUS
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">

        {/* Revenue */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Revenue Overview
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                ₹1,24,580
              </h2>
            </div>

            <button
              type="button"
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                text-slate-400
                hover:bg-slate-50
              "
            >
              <MoreHorizontal size={20} />
            </button>

          </div>

          {/* Fake premium chart */}

          <div className="mt-8">

            <div className="flex h-64 items-end gap-2 sm:gap-4">

              {[38, 52, 45, 67, 54, 72, 61, 82, 74, 91, 78, 96].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="
                        w-full rounded-t-lg
                        bg-gradient-to-t
                        from-pink-500
                        to-pink-300
                        opacity-80
                        transition-all duration-300
                        group-hover:from-pink-600
                        group-hover:to-rose-400
                        group-hover:opacity-100
                      "
                    />
                  </div>
                )
              )}

            </div>

            <div className="mt-3 flex justify-between text-[11px] font-medium text-slate-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>

          </div>

        </div>

        {/* Order Status */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Order Status
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                348 Orders
              </h2>
            </div>

            <ShoppingBag
              size={22}
              className="text-pink-500"
            />

          </div>

          <div className="mt-7 space-y-5">

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-600">
                  Delivered
                </span>

                <span className="font-bold text-slate-900">
                  184
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[72%] rounded-full bg-emerald-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-600">
                  Processing
                </span>

                <span className="font-bold text-slate-900">
                  76
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[48%] rounded-full bg-amber-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-600">
                  Shipped
                </span>

                <span className="font-bold text-slate-900">
                  52
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[32%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-600">
                  Pending
                </span>

                <span className="font-bold text-slate-900">
                  36
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[20%] rounded-full bg-pink-500" />
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 p-6">

          <div>
            <p className="text-sm font-medium text-slate-500">
              Latest activity
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Recent Orders
            </h2>
          </div>

          <button
            type="button"
            className="text-sm font-bold text-pink-600 hover:text-pink-700"
          >
            View all
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px]">

            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">

                <th className="px-6 py-4 font-bold">
                  Order
                </th>

                <th className="px-6 py-4 font-bold">
                  Customer
                </th>

                <th className="px-6 py-4 font-bold">
                  Product
                </th>

                <th className="px-6 py-4 font-bold">
                  Amount
                </th>

                <th className="px-6 py-4 font-bold">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {recentOrders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                >

                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {order.id}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {order.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {order.product}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {order.amount}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* =====================================================
          BOTTOM CARDS
      ===================================================== */}

      <section className="grid gap-6 lg:grid-cols-2">

        {/* Top Products */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Best sellers
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Top Products
              </h2>
            </div>

            <Package
              size={22}
              className="text-pink-500"
            />

          </div>

          <div className="space-y-5">

            {topProducts.map((product, index) => (

              <div
                key={product.name}
                className="flex items-center gap-4"
              >

                <div
                  className="
                    flex h-10 w-10
                    shrink-0 items-center
                    justify-center
                    rounded-xl
                    bg-pink-50
                    text-sm font-bold
                    text-pink-600
                  "
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-bold text-slate-900">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {product.category} · {product.sold} sold
                  </p>

                </div>

                <p className="text-sm font-bold text-slate-900">
                  {product.revenue}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Alerts */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <p className="text-sm font-medium text-slate-500">
              Store health
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Important Alerts
            </h2>

          </div>

          <div className="space-y-3">

            <div className="flex items-start gap-4 rounded-xl bg-amber-50 p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <AlertTriangle size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Low stock
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  7 products are running low on inventory.
                </p>
              </div>

            </div>

            <div className="flex items-start gap-4 rounded-xl bg-blue-50 p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Truck size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Orders to ship
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  12 orders are ready for shipment.
                </p>
              </div>

            </div>

            <div className="flex items-start gap-4 rounded-xl bg-emerald-50 p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Store running smoothly
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  No critical system issues detected.
                </p>
              </div>

            </div>

            <div className="flex items-start gap-4 rounded-xl bg-violet-50 p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Pending reviews
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  18 customer reviews need moderation.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}