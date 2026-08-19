import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-8xl font-bold text-pink-600">
        404
      </h1>

      <p className="text-gray-500 mt-4">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-8 bg-pink-600 text-white px-8 py-3 rounded-full"
      >
        Back Home
      </Link>

    </div>
  );
}

export default NotFound;