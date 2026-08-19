import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  Truck,
  Star,
  TicketPercent,
  BarChart3,
  UserRound,
  ChevronRight,
  Flower2,
  ExternalLink,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

// Agar tumhare authSlice me logout action hai to ye import use karo.
// Path agar different hai to apne project ke according change karna.
// import { logout } from "@/redux/slices/authSlice";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // AUTH USER
  // =====================================================

  const { user } = useSelector(
    (state) => state.auth || {}
  );

  // =====================================================
  // ADMIN MENU
  // =====================================================

  const menu = [
    {
      section: "Overview",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "/admin",
        },
        {
          name: "Analytics",
          icon: BarChart3,
          path: "/admin/analytics",
        },
      ],
    },

    {
      section: "Store Management",
      items: [
        {
          name: "Products",
          icon: Package,
          path: "/admin/products",
        },
        {
          name: "Add Product",
          icon: PlusCircle,
          path: "/admin/add-product",
        },
        {
          name: "Orders",
          icon: ShoppingCart,
          path: "/admin/orders",
        },
        {
          name: "Customers",
          icon: Users,
          path: "/admin/customers",
        },
      ],
    },

    {
      section: "Management",
      items: [
        {
          name: "Users",
          icon: UserRound,
          path: "/admin/users",
        },
        {
          name: "Suppliers",
          icon: Truck,
          path: "/admin/suppliers",
        },
        {
          name: "Reviews",
          icon: Star,
          path: "/admin/reviews",
        },
        {
          name: "Coupons",
          icon: TicketPercent,
          path: "/admin/coupons",
        },
      ],
    },

    {
      section: "System",
      items: [
        {
          name: "Settings",
          icon: Settings,
          path: "/admin/settings",
        },
      ],
    },
  ];

  // =====================================================
  // ACTIVE ROUTE
  // =====================================================

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  // =====================================================
  // ADMIN NAME
  // =====================================================

  const adminName =
    user?.name ||
    user?.username ||
    "Admin";

  const adminEmail =
    user?.email ||
    "Administrator";

  const avatarLetter =
    adminName?.charAt(0)?.toUpperCase() || "A";

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    // Agar Redux authSlice me logout action available hai,
    // yahan dispatch(logout()) use karna best hai.

    try {
      // dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // VIEW STORE
  // =====================================================

  const handleViewStore = () => {
    navigate("/");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-[280px]
        flex-col
        overflow-hidden
        border-r
        border-white/[0.08]
        bg-[#050816]
        text-white
      "
    >

      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-28
          -top-28
          h-80
          w-80
          rounded-full
          bg-pink-600/20
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-80
          w-80
          rounded-full
          bg-purple-600/10
          blur-[110px]
        "
      />

      {/* =================================================
          BRAND
      ================================================= */}

      <div
        className="
          relative
          flex
          h-[90px]
          shrink-0
          items-center
          gap-3
          border-b
          border-white/[0.07]
          px-6
        "
      >

        {/* LOGO */}

        <div
          className="
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            bg-gradient-to-br
            from-pink-500
            via-rose-500
            to-fuchsia-600
            shadow-lg
            shadow-pink-500/20
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-white/10
            "
          />

          <Flower2
            size={23}
            strokeWidth={2}
            className="relative text-white"
          />
        </div>

        {/* BRAND */}

        <div className="min-w-0">

          <h1
            className="
              truncate
              text-[18px]
              font-bold
              tracking-tight
              text-white
            "
          >
            The Flower Shop
          </h1>

          <p
            className="
              mt-0.5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-pink-400
            "
          >
            Admin Console
          </p>

        </div>

      </div>

      {/* =================================================
          ADMIN PROFILE
      ================================================= */}

      <div
        className="
          relative
          mx-4
          mt-5
          rounded-2xl
          border
          border-white/[0.07]
          bg-white/[0.035]
          p-3
          transition
          hover:border-pink-500/20
          hover:bg-white/[0.05]
        "
      >

        <div className="flex items-center gap-3">

          {/* AVATAR */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-pink-500
              to-rose-600
              text-sm
              font-bold
              shadow-lg
              shadow-pink-500/20
            "
          >
            {avatarLetter}
          </div>

          {/* INFO */}

          <div className="min-w-0 flex-1">

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-white
              "
            >
              {adminName}
            </p>

            <p
              className="
                truncate
                text-[11px]
                text-slate-400
              "
            >
              {adminEmail}
            </p>

          </div>

          {/* ONLINE */}

          <span
            title="Online"
            className="
              h-2
              w-2
              shrink-0
              rounded-full
              bg-emerald-400
              shadow-[0_0_10px_rgba(52,211,153,0.8)]
            "
          />

        </div>

      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav
        className="
          relative
          mt-5
          flex-1
          overflow-y-auto
          px-4
          pb-5
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-white/10
        "
      >

        {menu.map((group) => (
          <div
            key={group.section}
            className="mb-6"
          >

            {/* SECTION */}

            <p
              className="
                mb-2
                px-3
                text-[9px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-slate-500
              "
            >
              {group.section}
            </p>

            {/* ITEMS */}

            <div className="space-y-1">

              {group.items.map((item) => {

                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group relative block"
                  >

                    {/* ACTIVE BACKGROUND */}

                    {active && (
                      <motion.div
                        layoutId="admin-sidebar-active"
                        className="
                          absolute
                          inset-0
                          rounded-xl
                          bg-gradient-to-r
                          from-pink-600
                          via-rose-500
                          to-pink-500
                          shadow-lg
                          shadow-pink-600/20
                        "
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* MENU */}

                    <div
                      className={`
                        relative
                        flex
                        h-11
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        transition-all
                        duration-300

                        ${
                          active
                            ? "text-white"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                        }
                      `}
                    >

                      {/* ICON */}

                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition

                          ${
                            active
                              ? "bg-white/15"
                              : "bg-transparent group-hover:bg-white/[0.06]"
                          }
                        `}
                      >
                        <Icon
                          size={18}
                          strokeWidth={
                            active ? 2.2 : 1.8
                          }
                          className={`
                            transition-transform
                            duration-300

                            ${
                              active
                                ? "text-white"
                                : "group-hover:scale-110"
                            }
                          `}
                        />
                      </div>

                      {/* NAME */}

                      <span
                        className={`
                          flex-1
                          text-[13px]
                          ${
                            active
                              ? "font-semibold"
                              : "font-medium"
                          }
                        `}
                      >
                        {item.name}
                      </span>

                      {/* ARROW */}

                      <ChevronRight
                        size={15}
                        className={`
                          transition-all
                          duration-300

                          ${
                            active
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                          }
                        `}
                      />

                    </div>

                  </Link>
                );
              })}

            </div>

          </div>
        ))}

      </nav>

      {/* =================================================
          BOTTOM AREA
      ================================================= */}

      <div
        className="
          relative
          shrink-0
          space-y-2
          border-t
          border-white/[0.07]
          p-4
        "
      >

        {/* VIEW STORE */}

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewStore}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.035]
            px-4
            py-3
            text-left
            text-slate-300
            transition-all
            duration-300
            hover:border-pink-500/20
            hover:bg-pink-500/[0.07]
            hover:text-white
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-white/[0.05]
              transition
              group-hover:bg-pink-500/10
            "
          >
            <ExternalLink size={16} />
          </div>

          <div className="flex-1">

            <p className="text-sm font-semibold">
              View Store
            </p>

            <p className="text-[10px] text-slate-500">
              Open customer website
            </p>

          </div>

          <ChevronRight
            size={15}
            className="
              opacity-40
              transition
              group-hover:translate-x-1
            "
          />

        </motion.button>

        {/* LOGOUT */}

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-red-500/10
            bg-red-500/[0.06]
            px-4
            py-3
            text-left
            text-red-400
            transition-all
            duration-300
            hover:border-red-500/20
            hover:bg-red-500/10
            hover:text-red-300
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-red-500/10
            "
          >
            <LogOut
              size={17}
              strokeWidth={1.8}
            />
          </div>

          <div className="flex-1">

            <p className="text-sm font-semibold">
              Sign out
            </p>

            <p className="text-[10px] text-red-400/50">
              End admin session
            </p>

          </div>

          <ChevronRight
            size={15}
            className="
              opacity-0
              transition-all
              group-hover:translate-x-1
              group-hover:opacity-60
            "
          />

        </motion.button>

      </div>

    </aside>
  );
}