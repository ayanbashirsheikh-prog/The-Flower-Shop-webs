import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-72 bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold text-pink-500">
        🌸 Flower Admin
      </h1>

      <div className="mt-10 flex flex-col gap-5">
        <Link to="/admin">
          Dashboard
        </Link>

        <Link to="/admin/products">
          Products
        </Link>

        <Link to="/admin/add-product">
          Add Product
        </Link>

        <Link to="/admin/orders">
          Orders
        </Link>
      </div>
    </div>
  );
}