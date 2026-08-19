import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { store } from "./redux/store";

import { CartProvider } from "@/context/CartContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>

      <CartProvider>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            duration: 3000,

            style: {
              background: "#ffffff",
              color: "#111827",
              borderRadius: "18px",
              padding: "16px",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.12)",
            },

            success: {
              style: {
                border: "1px solid #f472b6",
              },

              iconTheme: {
                primary: "#ec4899",
                secondary: "#ffffff",
              },
            },

            error: {
              style: {
                border: "1px solid #ef4444",
              },
            },
          }}
        />

        <App />

      </CartProvider>

    </Provider>
  </React.StrictMode>
);