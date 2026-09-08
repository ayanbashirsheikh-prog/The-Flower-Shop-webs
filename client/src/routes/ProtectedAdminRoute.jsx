import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";

export default function ProtectedAdminRoute() {
  const location = useLocation();

  const {
    user,
    loading,
    isAuthenticated,
  } = useSelector(
    (state) => state.auth || {}
  );

  // =====================================================
  // AUTH CHECK LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f7]">
        <div className="flex flex-col items-center gap-5">

          <div
            className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-[3px]
              border-slate-200
              border-t-pink-600
            "
          />

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              Verifying access
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
          message:
            "Please login to access the admin panel.",
        }}
      />
    );
  }

  // =====================================================
  // ROLE NORMALIZATION
  // =====================================================

  const role = String(
    user?.role || ""
  )
    .trim()
    .toLowerCase();

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  if (role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
        state={{
          message:
            "Admin access required.",
        }}
      />
    );
  }

  // =====================================================
  // ADMIN AUTHORIZED
  // =====================================================

  return <Outlet />;
}