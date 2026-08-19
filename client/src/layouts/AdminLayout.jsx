import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Menu,
  Bell,
  Search,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const adminName = user?.name || "Admin";
  const adminEmail =
    user?.email || "Administrator";

  const avatarLetter =
    adminName?.charAt(0)?.toUpperCase() || "A";

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-slate-900">

      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="
            fixed inset-0 z-40
            bg-slate-950/40
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[280px]
          transform
          transition-transform duration-300 ease-out
          lg:hidden
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="relative h-full">

          <AdminSidebar />

          {/* Close button */}

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close admin menu"
            className="
              absolute right-3 top-3
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-600
              shadow-lg
              transition-all
              hover:border-pink-200
              hover:bg-pink-50
              hover:text-pink-600
            "
          >
            <X size={18} />
          </button>

        </div>
      </aside>

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className="
          fixed inset-y-0 left-0 z-30
          hidden w-[280px]
          lg:block
        "
      >
        <AdminSidebar />
      </aside>

      {/* =====================================================
          MAIN APPLICATION
      ===================================================== */}

      <div className="min-h-screen lg:pl-[280px]">

        {/* ===================================================
            TOP NAVBAR
        =================================================== */}

        <header
          className="
            sticky top-0 z-20
            flex h-[76px]
            items-center justify-between
            border-b border-slate-200/80
            bg-white/85
            px-4
            backdrop-blur-2xl
            sm:px-6
            lg:px-8
          "
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile menu */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition-all
                hover:border-pink-200
                hover:bg-pink-50
                hover:text-pink-600
                lg:hidden
              "
            >
              <Menu size={20} />
            </button>

            {/* Title */}

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h1
                  className="
                    truncate
                    text-base font-bold
                    text-slate-950
                    sm:text-lg
                  "
                >
                  Admin Dashboard
                </h1>

                <span
                  className="
                    hidden
                    rounded-full
                    bg-emerald-50
                    px-2 py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-600
                    sm:inline-flex
                  "
                >
                  Live
                </span>

              </div>

              <p
                className="
                  hidden
                  text-xs
                  text-slate-400
                  sm:block
                "
              >
                Manage your flower store
              </p>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* Store preview */}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                hidden
                items-center gap-2
                rounded-xl
                border border-slate-200
                bg-white
                px-3 py-2
                text-xs font-semibold
                text-slate-600
                transition-all
                hover:border-pink-200
                hover:bg-pink-50
                hover:text-pink-600
                md:flex
              "
            >
              <ExternalLink size={15} />

              View Store
            </button>

            {/* Search */}

            <button
              type="button"
              aria-label="Search"
              className="
                hidden h-10 w-10
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-500
                transition-all
                hover:border-pink-200
                hover:bg-pink-50
                hover:text-pink-600
                sm:flex
              "
            >
              <Search size={18} />
            </button>

            {/* Notifications */}

            <button
              type="button"
              aria-label="Notifications"
              className="
                relative
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                transition-all
                hover:border-pink-200
                hover:bg-pink-50
                hover:text-pink-600
              "
            >
              <Bell size={18} />

              {/* Notification dot */}

              <span
                className="
                  absolute
                  right-1.5 top-1.5
                  h-2 w-2
                  rounded-full
                  bg-pink-500
                  ring-2 ring-white
                "
              />
            </button>

            {/* =================================================
                ADMIN PROFILE
            ================================================= */}

            <div
              className="
                hidden
                items-center gap-3
                rounded-2xl
                border border-slate-200
                bg-white
                px-2.5 py-2
                shadow-sm
                sm:flex
              "
            >

              {/* Avatar */}

              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-pink-500
                  via-rose-500
                  to-purple-600
                  text-sm font-bold
                  text-white
                  shadow-md
                  shadow-pink-200/60
                "
              >
                {avatarLetter}
              </div>

              {/* User details */}

              <div className="max-w-[130px] leading-tight">

                <p
                  className="
                    truncate
                    text-sm
                    font-bold
                    text-slate-900
                  "
                >
                  {adminName}
                </p>

                <p
                  className="
                    truncate
                    text-[10px]
                    text-slate-400
                  "
                >
                  {adminEmail}
                </p>

              </div>

            </div>

          </div>
        </header>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main
          className="
            min-h-[calc(100vh-76px)]
            p-4
            sm:p-6
            lg:p-8
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}