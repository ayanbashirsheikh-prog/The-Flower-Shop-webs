import {
  Search,
  MoreHorizontal,
  Users as UsersIcon,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

const users = [
  {
    id: 1,
    name: "Ayan",
    email: "admin@theflowershop.com",
    role: "Admin",
    orders: 12,
    spent: 24999,
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Shah",
    email: "priya@example.com",
    role: "Customer",
    orders: 8,
    spent: 12990,
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Mehta",
    email: "rahul@example.com",
    role: "Customer",
    orders: 5,
    spent: 8490,
    status: "Active",
  },
  {
    id: 4,
    name: "Neha Patil",
    email: "neha@example.com",
    role: "Customer",
    orders: 2,
    spent: 3499,
    status: "Blocked",
  },
];

export default function Users() {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div className="min-h-screen bg-[#f8f8fa] p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-pink-600">
          Customer Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Users
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage customers, administrators and account activity.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Users", "520", UsersIcon],
          ["Active Users", "486", UserCheck],
          ["Blocked", "12", UserX],
          ["Admins", "4", ShieldCheck],
        ].map(([label, value, Icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>

              <div className="rounded-xl bg-pink-50 p-2 text-pink-600">
                <Icon size={18} />
              </div>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              All Users
            </h2>

            <p className="text-sm text-slate-500">
              Customer account directory
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
              placeholder="Search users..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-pink-50/30"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100 font-bold text-pink-600">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "Admin"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5 font-semibold">
                    {user.orders}
                  </td>

                  <td className="px-6 py-5 font-semibold text-pink-600">
                    ₹{user.spent.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                      <MoreHorizontal size={19} />
                    </button>
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