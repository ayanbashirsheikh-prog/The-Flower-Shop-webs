export default function OrderTracking() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">

      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="mb-10 text-4xl font-bold">
          Track Order 🚚
        </h1>

        <div className="flex justify-between">

          <div className="text-center">

            <div className="h-16 w-16 rounded-full bg-green-500" />

            <p className="mt-2 font-semibold">
              Ordered
            </p>

          </div>

          <div className="text-center">

            <div className="h-16 w-16 rounded-full bg-green-500" />

            <p className="mt-2 font-semibold">
              Packed
            </p>

          </div>

          <div className="text-center">

            <div className="h-16 w-16 rounded-full bg-yellow-500" />

            <p className="mt-2 font-semibold">
              Shipped
            </p>

          </div>

          <div className="text-center">

            <div className="h-16 w-16 rounded-full bg-gray-300" />

            <p className="mt-2 font-semibold">
              Delivered
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}