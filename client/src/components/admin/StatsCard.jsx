export default function StatsCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="text-gray-500">{title}</h3>

      <h2 className="mt-2 text-3xl font-bold text-pink-600">
        {value}
      </h2>
    </div>
  );
}