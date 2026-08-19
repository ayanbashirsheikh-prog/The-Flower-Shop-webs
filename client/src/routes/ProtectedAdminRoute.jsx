import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedAdminRoute() {
  const location = useLocation();

  const { user, token, loading } = useSelector(
    (state) => state.auth || {}
  );

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="text-sm font-medium text-gray-500">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message:
            "Please login to access the admin panel.",
        }}
      />
    );
  }

  // =====================================================
  // ADMIN AUTHORIZATION
  // =====================================================

  const role = String(user?.role || "")
    .trim()
    .toLowerCase();

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
  // AUTHORIZED
  // =====================================================

  return <Outlet />;
}