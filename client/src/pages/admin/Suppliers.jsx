import {
  Plus,
  Search,
  MoreHorizontal,
  Building2,
  Phone,
  Mail,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const suppliers = [
  {
    id: 1,
    name: "Rose Garden Farms",
    contact: "Rahul Sharma",
    email: "contact@rosegarden.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra",
    products: 24,
    status: "Active",
  },
  {
    id: 2,
    name: "Bloom Valley",
    contact: "Priya Mehta",
    email: "hello@bloomvalley.com",
    phone: "+91 98200 12345",
    location: "Nashik, Maharashtra",
    products: 18,
    status: "Active",
  },
  {
    id: 3,
    name: "Royal Petals",
    contact: "Arjun Patel",
    email: "sales@royalpetals.com",
    phone: "+91 99887 77665",
    location: "Mumbai, Maharashtra",
    products: 31,
    status: "Pending",
  },
  {
    id: 4,
    name: "Fresh Bloom Co.",
    contact: "Neha Singh",
    email: "fresh@bloomco.com",
    phone: "+91 97654 32109",
    location: "Thane, Maharashtra",
    products: 12,
    status: "Inactive",
  },
];

const statusConfig = {
  Active: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  Pending: {
    icon: Clock,
    className: "bg-amber-50 text-amber-600 border-amber-100",
  },
  Inactive: {
    icon: XCircle,
    className: "bg-red-50 text-red-500 border-red-100",
  },
};

export default function Suppliers() {
  const [search, setSearch] = useState("");

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) =>
      `${supplier.name} ${supplier.contact} ${supplier.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-[#f8f8fa] p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-pink-600">
            Business Management
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage flower suppliers and inventory partners.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600">
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Suppliers", "24", Building2],
          ["Active Suppliers", "19", CheckCircle2],
          ["Pending Approval", "3", Clock],
          ["Total Products", "185", Package],
        ].map(([label, value, Icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <div className="rounded-xl bg-pink-50 p-2 text-pink-600">
                <Icon size={18} />
              </div>
            </div>

            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Supplier Directory</h2>
            <p className="text-sm text-slate-500">
              {filteredSuppliers.length} suppliers shown
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((supplier) => {
                const config = statusConfig[supplier.status];
                const StatusIcon = config.icon;

                return (
                  <tr
                    key={supplier.id}
                    className="transition hover:bg-pink-50/30"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 font-bold text-pink-600">
                          {supplier.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {supplier.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Supplier #{supplier.id.toString().padStart(4, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-800">
                        {supplier.contact}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <Mail size={12} />
                        {supplier.email}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-pink-500" />
                        {supplier.location}
                      </div>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {supplier.products}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
                      >
                        <StatusIcon size={13} />
                        {supplier.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800">
                        <MoreHorizontal size={19} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}