import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

const monthlySales = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 56000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 72000 },
  { month: "May", value: 68000 },
  { month: "Jun", value: 91000 },
  { month: "Jul", value: 125000 },
];

const topProducts = [
  {
    name: "Premium Red Roses",
    category: "Roses",
    sales: 128,
    revenue: 63872,
  },
  {
    name: "Luxury Pink Bouquet",
    category: "Bouquets",
    sales: 96,
    revenue: 47904,
  },
  {
    name: "White Lily Collection",
    category: "Lilies",
    sales: 74,
    revenue: 29526,
  },
  {
    name: "Elegant Mixed Flowers",
    category: "Mixed",
    sales: 61,
    revenue: 24339,
  },
];

export default function Analytics() {
  const maxValue = Math.max(...monthlySales.map((item) => item.value));

  return (
    <div className="min-h-screen bg-[#f8f8fa] p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-pink-600">
            Business Intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your store performance and sales growth.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          <CalendarDays size={17} />
          Last 7 Months
        </button>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Total Revenue"
          value="₹5,42,800"
          growth="+18.4%"
          icon={IndianRupee}
          positive
        />

        <Metric
          title="Total Orders"
          value="1,248"
          growth="+12.8%"
          icon={ShoppingBag}
          positive
        />

        <Metric
          title="Customers"
          value="5,420"
          growth="+8.6%"
          icon={Users}
          positive
        />

        <Metric
          title="Products Sold"
          value="3,842"
          growth="-2.4%"
          icon={Package}
          positive={false}
        />
      </div>

      {/* Revenue Chart */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Revenue Overview
            </h2>

            <p className="text-sm text-slate-500">
              Monthly revenue performance
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600">
            +18.4%
          </div>
        </div>

        <div className="flex h-72 items-end gap-3 sm:gap-6">
          {monthlySales.map((item) => {
            const height = (item.value / maxValue) * 100;

            return (
              <div
                key={item.month}
                className="group flex h-full flex-1 flex-col justify-end"
              >
                <div className="relative flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-pink-600 to-pink-400 transition-all duration-500 group-hover:from-slate-950 group-hover:to-slate-700"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-2 py-1 text-xs font-semibold text-white group-hover:block">
                      ₹{item.value.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-xs font-medium text-slate-400">
                  {item.month}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Top Products
              </h2>

              <p className="text-sm text-slate-500">
                Best performing flowers
              </p>
            </div>

            <button className="text-sm font-semibold text-pink-600">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-pink-100 hover:bg-pink-50/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 font-bold text-pink-600">
                  #{index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {product.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {product.category} · {product.sales} sold
                  </p>
                </div>

                <p className="font-bold text-slate-900">
                  ₹{product.revenue.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-bold text-slate-900">
              Store Performance
            </h2>

            <p className="text-sm text-slate-500">
              Key performance indicators
            </p>
          </div>

          <div className="space-y-6">
            <Progress
              label="Order Completion"
              value="94%"
              progress={94}
            />

            <Progress
              label="Customer Satisfaction"
              value="96%"
              progress={96}
            />

            <Progress
              label="Product Availability"
              value="87%"
              progress={87}
            />

            <Progress
              label="Repeat Customers"
              value="68%"
              progress={68}
            />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Revenue Forecast
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹1,48,500
                </p>

                <p className="mt-1 text-xs text-emerald-400">
                  Expected next month
                </p>
              </div>

              <ArrowUpRight className="text-pink-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  growth,
  icon: Icon,
  positive,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-pink-50 p-2.5 text-pink-600">
          <Icon size={19} />
        </div>

        {positive ? (
          <TrendingUp size={17} className="text-emerald-500" />
        ) : (
          <TrendingDown size={17} className="text-red-500" />
        )}
      </div>

      <p className="mt-5 text-sm text-slate-500">{title}</p>

      <div className="mt-1 flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-900">{value}</p>

        <span
          className={`text-xs font-bold ${
            positive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {growth}
        </span>
      </div>
    </div>
  );
}

function Progress({ label, value, progress }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}