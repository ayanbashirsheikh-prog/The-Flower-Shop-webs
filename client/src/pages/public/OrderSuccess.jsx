import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-white px-4">

      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl">

        <CheckCircle
          size={120}
          className="mx-auto text-green-500"
        />

        <h1 className="mt-6 text-4xl font-bold">
          Order Placed 🎉
        </h1>

        <p className="mt-4 text-gray-500">
          Thank you for shopping with
          The Flower Shop 🌸
        </p>

        <div className="mt-8 rounded-2xl bg-pink-50 p-6">

          <h2 className="text-xl font-bold">
            Order ID
          </h2>

          <p className="mt-2 text-pink-600">
            #FLOWER-928371
          </p>

        </div>

        <div className="mt-8 flex gap-4">

          <Link
            to="/track-order"
            className="flex-1 rounded-xl bg-pink-600 py-4 text-white"
          >
            Track Order
          </Link>

          <Link
            to="/"
            className="flex-1 rounded-xl border py-4"
          >
            Home
          </Link>

        </div>

      </div>

    </div>
  );
}