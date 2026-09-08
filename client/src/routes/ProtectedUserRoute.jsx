import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedUserRoute() {
  const location = useLocation();

  const user = useSelector(
    (state) => state.auth?.user
  );

  const token = useSelector(
    (state) => state.auth?.token
  );

  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}