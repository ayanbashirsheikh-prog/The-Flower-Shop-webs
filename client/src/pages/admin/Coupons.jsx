import {
  Plus,
  Search,
  Copy,
  MoreHorizontal,
  TicketPercent,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const coupons = [
  {
    id: 1,
    code: "WELCOME10",
    discount: "10%",
    type: "Percentage",
    usage: "128 / 500",
    expires: "31 Aug 2026",
    status: "Active",
  },
  {
    id: 2,
    code: "FLOWER500",
    discount: "₹500",
    type: "Fixed",
    usage: "84 / 200",
    expires: "25 Aug 2026",
    status: "Active",
  },
  {
    id: 3,
    code: "LOVE20",
    discount: "20%",
    type: "Percentage",
    usage: "200 / 200",
    expires: "10 Aug 2026",
    status: "Expired",
  },
  {
    id: 4,
    code: "FIRSTORDER",
    discount: "15%",
    type: "Percentage",
    usage: "46 / 100",
    expires: "15 Sep 2026",
    status: "Scheduled",
  },
];

export default function Coupons() {
  const [search, setSearch] = useState("");

  const filtered = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f8fa] p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-pink-600">
            Marketing
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Coupons
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage promotional offers.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600">
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Coupons" value="24" icon={TicketPercent} />
        <Stat title="Active" value="16" icon={CheckCircle2} />
        <Stat title="Scheduled" value="4" icon={Clock} />
        <Stat title="Expired" value="4" icon={XCircle} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Promotional Codes
            </h2>
            <p className="text-sm text-slate-500">
              Manage discounts and offers
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
              placeholder="Search coupon..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Coupon</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="transition hover:bg-pink-50/20"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
                        <TicketPercent size={18} />
                      </div>

                      <div>
                        <p className="font-bold tracking-wide text-slate-900">
                          {coupon.code}
                        </p>
                        <p className="text-xs text-slate-400">
                          {coupon.type}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-lg font-bold text-pink-600">
                    {coupon.discount}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-slate-600">
                    {coupon.usage}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {coupon.expires}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        coupon.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : coupon.status === "Scheduled"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-500"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() =>
                          navigator.clipboard?.writeText(coupon.code)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-pink-50 hover:text-pink-600"
                        title="Copy coupon"
                      >
                        <Copy size={17} />
                      </button>

                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{title}</span>

        <div className="rounded-xl bg-pink-50 p-2 text-pink-600">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}