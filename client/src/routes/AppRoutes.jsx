import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// =====================================================
// LAYOUTS
// =====================================================

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// =====================================================
// ROUTE GUARDS
// =====================================================

import ProtectedAdminRoute from "./ProtectedAdminRoute";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "../pages/public/Home";
import Shop from "../pages/public/Shop";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import ProductDetails from "../pages/public/ProductDetails";
import Cart from "../pages/public/Cart";
import Checkout from "../pages/public/Checkout";
import OrderSuccess from "../pages/public/OrderSuccess";
import OrderTracking from "../pages/public/OrderTracking";
import Wishlist from "../pages/public/Wishlist";
import Profile from "../pages/public/Profile";
import NotFound from "../pages/public/NotFound";

// =====================================================
// AUTH PAGES
// =====================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// =====================================================
// ADMIN PAGES
// =====================================================

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/EditProducts";
import AddProduct from "../pages/admin/AddProduct";
import Orders from "../pages/admin/Orders";
import Customers from "../pages/admin/Customers";
import Settings from "../pages/admin/Settings";
import Supplier from "../pages/admin/Supplier";
import Users from "../pages/admin/Users";
import Reviews from "../pages/admin/Reviews";
import Coupons from "../pages/admin/Coupons";
import Analytics from "../pages/admin/Analytics";

// =====================================================
// APP ROUTES
// =====================================================

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC WEBSITE
        ================================================= */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="/track-order"
            element={<OrderTracking />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

        {/* =================================================
            AUTHENTICATION
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            PROTECTED ADMIN AREA
        ================================================= */}

        <Route element={<ProtectedAdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* ---------------------------------------------
                ADMIN DASHBOARD
            --------------------------------------------- */}

            <Route
              index
              element={<Dashboard />}
            />

            {/* ---------------------------------------------
                PRODUCTS
            --------------------------------------------- */}

            <Route
              path="products"
              element={<Products />}
            />

            <Route
              path="add-product"
              element={<AddProduct />}
            />

            {/* ---------------------------------------------
                ORDERS
            --------------------------------------------- */}

            <Route
              path="orders"
              element={<Orders />}
            />

            {/* ---------------------------------------------
                CUSTOMERS / USERS
            --------------------------------------------- */}

            <Route
              path="customers"
              element={<Customers />}
            />

            <Route
              path="users"
              element={<Users />}
            />

            {/* ---------------------------------------------
                SUPPLIERS
            --------------------------------------------- */}

            <Route
              path="suppliers"
              element={<Supplier />}
            />

            {/* ---------------------------------------------
                REVIEWS
            --------------------------------------------- */}

            <Route
              path="reviews"
              element={<Reviews />}
            />

            {/* ---------------------------------------------
                MARKETING
            --------------------------------------------- */}

            <Route
              path="coupons"
              element={<Coupons />}
            />

            {/* ---------------------------------------------
                ANALYTICS
            --------------------------------------------- */}

            <Route
              path="analytics"
              element={<Analytics />}
            />

            {/* ---------------------------------------------
                SETTINGS
            --------------------------------------------- */}

            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Route>

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}