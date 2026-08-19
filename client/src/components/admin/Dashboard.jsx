import AdminSidebar from "@/components/admin/AdminSidebar";

export default function Dashboard() {
  return (
    <div className="flex">

      <AdminSidebar />

      <main className="flex-1 bg-slate-100 p-8">

        <h1 className="mb-8 text-5xl font-bold">
          Dashboard 📊
        </h1>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <h3>Total Orders</h3>
            <h1 className="mt-4 text-4xl font-bold">
              1250
            </h1>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <h3>Total Revenue</h3>
            <h1 className="mt-4 text-4xl font-bold">
              ₹1,25,000
            </h1>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <h3>Customers</h3>
            <h1 className="mt-4 text-4xl font-bold">
              4500
            </h1>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <h3>Products</h3>
            <h1 className="mt-4 text-4xl font-bold">
              350
            </h1>
          </div>

        </div>

      </main>

    </div>
  );
}