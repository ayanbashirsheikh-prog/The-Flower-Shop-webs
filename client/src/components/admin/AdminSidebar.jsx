import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserRoundCog,
  Truck,
  Star,
  TicketPercent,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
  Store,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const menuGroups = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
        },
        {
          name: "Analytics",
          path: "/admin/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Store Management",
      items: [
        {
          name: "Products",
          path: "/admin/products",
          icon: Package,
        },
        {
          name: "Add Product",
          path: "/admin/add-product",
          icon: PlusCircle,
        },
        {
          name: "Orders",
          path: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          name: "Customers",
          path: "/admin/customers",
          icon: Users,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          name: "Users",
          path: "/admin/users",
          icon: UserRoundCog,
        },
        {
          name: "Suppliers",
          path: "/admin/suppliers",
          icon: Truck,
        },
        {
          name: "Reviews",
          path: "/admin/reviews",
          icon: Star,
        },
        {
          name: "Coupons",
          path: "/admin/coupons",
          icon: TicketPercent,
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          name: "Store Settings",
          path: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const adminName = user?.name || "Admin";

  const adminInitial = adminName
    .charAt(0)
    .toUpperCase();

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white">

      {/* BRAND */}
      <div className="border-b border-slate-100 px-6 py-6">
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-xl shadow-lg shadow-pink-200">
            🌸
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              The Flower Shop
            </h1>

            <p className="text-xs font-medium text-slate-400">
              Premium Admin
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-7">

          {menuGroups.map((group) => (
            <div key={group.title}>

              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {group.title}
              </p>

              <div className="space-y-1">

                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/admin"}
                      className={({ isActive }) => `
                        group flex items-center gap-3
                        rounded-xl px-3.5 py-3
                        text-sm font-semibold
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-pink-50 text-pink-600 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`
                              flex h-9 w-9 items-center justify-center
                              rounded-lg transition-all
                              ${
                                isActive
                                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-white"
                              }
                            `}
                          >
                            <Icon size={18} />
                          </span>

                          <span className="flex-1">
                            {item.name}
                          </span>

                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

              </div>
            </div>
          ))}

        </div>
      </nav>

      {/* VIEW STORE */}
      <div className="px-4 pb-3">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
        >
          <Store size={18} />
          <span>View Store</span>
        </button>

      </div>

      {/* ADMIN ACCOUNT */}
      <div className="border-t border-slate-100 p-4">

        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-sm font-bold text-white">
            {adminInitial}
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-bold text-slate-900">
              {adminName}
            </p>

            <p className="truncate text-xs text-slate-400">
              Administrator
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}