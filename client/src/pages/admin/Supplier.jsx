import {
  Truck,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Package,
  MoreHorizontal,
  Star,
  CheckCircle2,
} from "lucide-react";

const suppliers = [
  {
    id: 1,
    name: "Bloom Fresh Farms",
    contact: "Rahul Sharma",
    email: "bloomfresh@example.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra",
    products: 24,
    rating: 4.9,
    status: "Active",
  },
  {
    id: 2,
    name: "Royal Rose Gardens",
    contact: "Priya Mehta",
    email: "royalrose@example.com",
    phone: "+91 98200 12345",
    location: "Nashik, Maharashtra",
    products: 18,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 3,
    name: "Petal Paradise",
    contact: "Amit Patel",
    email: "petalparadise@example.com",
    phone: "+91 97654 32109",
    location: "Mumbai, Maharashtra",
    products: 31,
    rating: 4.7,
    status: "Active",
  },
  {
    id: 4,
    name: "Gardenia Flowers",
    contact: "Sneha Kapoor",
    email: "gardenia@example.com",
    phone: "+91 98989 45678",
    location: "Bangalore, Karnataka",
    products: 12,
    rating: 4.6,
    status: "Inactive",
  },
];

export default function Supplier() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <Truck size={22} />
            </div>

            <span className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Suppliers
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage flower suppliers, inventory sources and supplier
            relationships.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus size={19} />
          Add Supplier
        </button>
      </div>

      {/* STATS */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Truck}
          label="Total Suppliers"
          value="24"
          detail="+3 this month"
        />

        <StatCard
          icon={CheckCircle2}
          label="Active Suppliers"
          value="21"
          detail="87.5% active"
        />

        <StatCard
          icon={Package}
          label="Products Supplied"
          value="156"
          detail="+12 this month"
        />

        <StatCard
          icon={Star}
          label="Average Rating"
          value="4.8"
          detail="Excellent"
        />
      </div>

      {/* TOOLBAR */}
      <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search suppliers..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 outline-none focus:border-pink-400">
            <option>All Suppliers</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* SUPPLIER TABLE */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Supplier
                </th>

                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Contact
                </th>

                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Location
                </th>

                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Products
                </th>

                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Rating
                </th>

                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-slate-100 last:border-0 transition hover:bg-pink-50/30"
                >
                  {/* SUPPLIER */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-xl">
                        🌸
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {supplier.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Supplier #{String(supplier.id).padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-5">
                    <p className="font-medium text-slate-800">
                      {supplier.contact}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <Mail size={13} />
                      {supplier.email}
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin
                        size={15}
                        className="text-pink-500"
                      />
                      {supplier.location}
                    </div>
                  </td>

                  {/* PRODUCTS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Package
                        size={16}
                        className="text-slate-400"
                      />

                      <span className="font-semibold text-slate-800">
                        {supplier.products}
                      </span>
                    </div>
                  </td>

                  {/* RATING */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />

                      <span className="font-semibold text-slate-800">
                        {supplier.rating}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        supplier.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          supplier.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />

                      {supplier.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-right">
                    <button
                      type="button"
                      className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-5 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-600">
            {suppliers.length}
          </span>{" "}
          suppliers
        </p>

        <p className="flex items-center gap-2">
          <Phone size={14} />
          Supplier support available
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100/50">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
          <Icon size={21} />
        </div>

        <span className="text-xs font-medium text-emerald-500">
          {detail}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}