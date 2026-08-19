import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Box,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹1,28,450",
    change: "+12.8%",
    icon: CircleDollarSign,
  },
  {
    title: "Orders",
    value: "248",
    change: "+8.4%",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    value: "1,842",
    change: "+14.2%",
    icon: Users,
  },
  {
    title: "Products",
    value: "86",
    change: "+5.1%",
    icon: Package,
  },
];

const recentOrders = [
  {
    id: "#TF-1048",
    customer: "Aarav Sharma",
    product: "Premium Rose Bouquet",
    amount: "₹2,499",
    status: "Delivered",
  },
  {
    id: "#TF-1047",
    customer: "Sara Khan",
    product: "Pink Peony Collection",
    amount: "₹1,899",
    status: "Processing",
  },
  {
    id: "#TF-1046",
    customer: "Rohan Mehta",
    product: "Luxury Red Roses",
    amount: "₹3,499",
    status: "Shipped",
  },
  {
    id: "#TF-1045",
    customer: "Ananya Patel",
    product: "White Lily Bouquet",
    amount: "₹1,299",
    status: "Pending",
  },
];

const topProducts = [
  {
    name: "Premium Red Roses",
    sold: 84,
    revenue: "₹41,160",
  },
  {
    name: "Pink Peony Bouquet",
    sold: 62,
    revenue: "₹32,860",
  },
  {
    name: "White Lily Collection",
    sold: 48,
    revenue: "₹21,552",
  },
];

function statusClasses(status) {
  const styles = {
    Delivered: "bg-emerald-50 text-emerald-700",
    Processing: "bg-amber-50 text-amber-700",
    Shipped: "bg-blue-50 text-blue-700",
    Pending: "bg-gray-100 text-gray-600",
  };

  return styles[status] || styles.Pending;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const today = useMemo(() => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-xl">
        <div className="flex h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-lg">
              <Sparkles size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
                The Flower Shop
              </p>

              <h1 className="text-lg font-bold text-gray-950">
                Admin Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 sm:block"
            >
              {today}
            </button>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-600" />
            </button>

            <button
              type="button"
              onClick={logout}
              className="hidden rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600 sm:block"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        {/* HERO */}

        <section className="relative overflow-hidden rounded-[32px] bg-gray-950 p-7 text-white shadow-2xl sm:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-pink-200">
                <Sparkles size={14} />
                Store overview
              </div>

              <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                Welcome back, Admin.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                Manage your flower store, orders, customers and
                products from one beautiful workspace.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/products")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-gray-950 transition hover:scale-[1.02] hover:bg-pink-50"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </section>

        {/* ================= STATS ================= */}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-[28px] border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white">
                    <Icon size={21} />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <TrendingUp size={13} />
                    {stat.change}
                  </span>
                </div>

                <p className="mt-6 text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* ================= CONTENT GRID ================= */}

        <section className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          {/* SALES */}

          <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Analytics
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Sales overview
                </h3>
              </div>

              <button className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600">
                Last 7 days
              </button>
            </div>

            <div className="mt-8 flex h-[280px] items-end gap-3 border-b border-l border-gray-100 px-3 pb-0 pt-6 sm:gap-6">
              {[45, 62, 50, 78, 66, 88, 96].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      className="relative w-full rounded-t-2xl bg-gradient-to-t from-pink-600 to-rose-300 transition-all duration-500 group-hover:from-gray-950 group-hover:to-gray-700"
                      style={{
                        height: `${height}%`,
                      }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 opacity-0 transition group-hover:opacity-100">
                        ₹{height}k
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex justify-between px-2 text-xs font-medium text-gray-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Management
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              Quick actions
            </h3>

            <div className="mt-6 space-y-3">
              {[
                {
                  label: "Manage Products",
                  icon: Package,
                  path: "/admin/products",
                },
                {
                  label: "View Orders",
                  icon: ClipboardList,
                  path: "/admin/orders",
                },
                {
                  label: "Customers",
                  icon: Users,
                  path: "/admin/customers",
                },
                {
                  label: "Inventory",
                  icon: Box,
                  path: "/admin/inventory",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-pink-100 hover:bg-pink-50"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Icon
                        size={19}
                        className="text-gray-700 transition group-hover:text-pink-600"
                      />
                    </div>

                    <span className="flex-1 text-sm font-semibold">
                      {item.label}
                    </span>

                    <ChevronRight
                      size={17}
                      className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-pink-600"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= ORDERS + PRODUCTS ================= */}

        <section className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          {/* RECENT ORDERS */}

          <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm">
            <div className="flex items-center justify-between p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Orders
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Recent orders
                </h3>
              </div>

              <button
                onClick={() => navigate("/admin/orders")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600"
              >
                View all
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50/70 text-left text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4 font-semibold">
                      Order
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Customer
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-6 py-5 text-sm font-bold">
                        {order.id}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {order.customer}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {order.product}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold">
                        {order.amount}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP PRODUCTS */}

          <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Best sellers
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Top products
                </h3>
              </div>

              <ShoppingCart
                size={21}
                className="text-pink-600"
              />
            </div>

            <div className="mt-6 space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="rounded-2xl bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
                      0{index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {product.sold} units sold
                      </p>
                    </div>

                    <p className="text-sm font-bold text-pink-600">
                      {product.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}