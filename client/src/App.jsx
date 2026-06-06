import { useState } from "react";
import "./index.css";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  AdminAuth,
  AdminDashboard,
  AdminLayout,
  AdminPlaceholder,
  AdminProductForm,
  AdminProducts,
  AdminReports,
  AdminSettings,
  Home,
  PasswordReset,
  Product,
  Products,
  RouteError,
  VerifyEmail,
} from "./pages/index.js";
import { Footer, Login, Navbar } from "./components/index.js";

const StoreLayout = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <Login setShowLogin={setShowLogin} /> : null}
      <Navbar setShowLogin={setShowLogin} />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "products/:id", element: <Products /> },
      { path: "product/:id", element: <Product /> },
      { path: "password-reset", element: <PasswordReset /> },
      { path: "password-reset/:token", element: <PasswordReset /> },
      { path: "forgot-password", element: <PasswordReset /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "verify-email/:token", element: <VerifyEmail /> },
    ],
  },
  {
    path: "/admin",
    errorElement: <RouteError />,
    children: [
      { index: true, element: <AdminAuth /> },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "products/new", element: <AdminProductForm /> },
          { path: "reports", element: <AdminReports /> },
          { path: "orders", element: <AdminPlaceholder title="Orders" eyebrow="Operations" /> },
          { path: "customers", element: <AdminPlaceholder title="Customers" eyebrow="Accounts" /> },
          { path: "settings", element: <AdminSettings /> },
        ],
      },
    ],
  },
  { path: "*", element: <RouteError /> },
]);

const App = () => (
  <>
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    <RouterProvider router={router} />
  </>
);

export default App;
