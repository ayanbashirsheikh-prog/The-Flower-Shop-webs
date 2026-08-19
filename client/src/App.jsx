import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-[#faf8f7] text-gray-900">
        <AppRoutes />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "16px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "500",
            background: "#18181b",
            color: "#fff",
          },
        }}
      />
    </>
  );
}