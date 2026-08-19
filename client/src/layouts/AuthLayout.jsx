export default function AuthLayout({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50 px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="mb-8 text-center text-4xl font-bold text-pink-600">
          {title}
        </h1>

        {children}

      </div>

    </div>
  );
}