import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  UserRound,
  Mail,
  CalendarDays,
  ShoppingBag,
  IndianRupee,
  MoreHorizontal,
  Crown,
  UserCheck,
} from "lucide-react";

const customers = [
  {
    id: "CUS-001",
    name: "Aarav Mehta",
    email: "aarav@example.com",
    orders: 18,
    spent: 28450,
    joined: "12 Jan 2026",
    status: "Active",
    tier: "VIP",
  },
  {
    id: "CUS-002",
    name: "Sara Khan",
    email: "sara@example.com",
    orders: 12,
    spent: 19890,
    joined: "02 Feb 2026",
    status: "Active",
    tier: "Premium",
  },
  {
    id: "CUS-003",
    name: "Riya Sharma",
    email: "riya@example.com",
    orders: 8,
    spent: 12490,
    joined: "18 Mar 2026",
    status: "Active",
    tier: "Regular",
  },
  {
    id: "CUS-004",
    name: "Kabir Patel",
    email: "kabir@example.com",
    orders: 5,
    spent: 7890,
    joined: "21 Apr 2026",
    status: "Active",
    tier: "Regular",
  },
  {
    id: "CUS-005",
    name: "Ananya Singh",
    email: "ananya@example.com",
    orders: 15,
    spent: 23100,
    joined: "03 May 2026",
    status: "Inactive",
    tier: "Premium",
  },
  {
    id: "CUS-006",
    name: "Zoya Ali",
    email: "zoya@example.com",
    orders: 23,
    spent: 38900,
    joined: "14 May 2026",
    status: "Active",
    tier: "VIP",
  },
];

export default function Customers() {
  const [search, setSearch] =
    useState("");

  const filteredCustomers =
    useMemo(() => {
      return customers.filter(
        (customer) =>
          customer.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          customer.email
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          customer.id
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [search]);

  const totalSpent =
    customers.reduce(
      (sum, customer) =>
        sum + customer.spent,
      0
    );

  return (
    <div className="min-h-screen bg-[#f7f7f9] p-4 md:p-8">
      {/* HEADER */}

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-pink-600">
          <Users size={16} />
          Customer Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Customers
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your customers, purchase activity
          and lifetime value.
        </p>
      </div>

      {/* STATS */}

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CustomerStat
          icon={Users}
          title="Total Customers"
          value={customers.length}
          detail="Registered customers"
        />

        <CustomerStat
          icon={UserCheck}
          title="Active Customers"
          value={
            customers.filter(
              (c) => c.status === "Active"
            ).length
          }
          detail="Currently active"
        />

        <CustomerStat
          icon={Crown}
          title="VIP Customers"
          value={
            customers.filter(
              (c) => c.tier === "VIP"
            ).length
          }
          detail="Top customers"
        />

        <CustomerStat
          icon={IndianRupee}
          title="Customer Value"
          value={`₹${totalSpent.toLocaleString(
            "en-IN"
          )}`}
          detail="Total purchase value"
        />
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-slate-950">
              All Customers
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredCustomers.length} customers
              found
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customers..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Orders
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Spent
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Customer Tier
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Joined
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th />
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map(
                (customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                    className="border-b border-slate-100 transition hover:bg-pink-50/30"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100 text-sm font-bold text-pink-600">
                          {customer.name
                            .split(" ")
                            .map(
                              (word) =>
                                word[0]
                            )
                            .join("")}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {customer.name}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <Mail size={12} />
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                        <ShoppingBag
                          size={15}
                          className="text-pink-500"
                        />
                        {customer.orders}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">
                        ₹
                        {customer.spent.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <TierBadge
                        tier={customer.tier}
                      />
                    </td>

                    <td className="px-6 py-5">
                      <span className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays
                          size={15}
                        />
                        {customer.joined}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          customer.status ===
                          "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-4">
                      <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <MoreHorizontal
                          size={18}
                        />
                      </button>
                    </td>
                  </motion.tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomerStat({
  icon: Icon,
  title,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {detail}
      </p>
    </div>
  );
}

function TierBadge({ tier }) {
  const styles = {
    VIP: "bg-amber-50 text-amber-700 border-amber-200",
    Premium:
      "bg-purple-50 text-purple-700 border-purple-200",
    Regular:
      "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
        styles[tier]
      }`}
    >
      {tier}
    </span>
  );
}