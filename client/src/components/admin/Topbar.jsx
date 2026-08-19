export default function Topbar() {
  return (
    <div className="bg-white shadow p-5 flex justify-between">
      <h2 className="text-2xl font-bold">
        Welcome Admin 👋
      </h2>

      <button className="bg-pink-600 text-white px-5 py-2 rounded-xl">
        Logout
      </button>
    </div>
  );
}