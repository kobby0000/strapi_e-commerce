import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaBoxOpen,
  FaChartLine,
  FaChevronLeft,
  FaCog,
  FaHome,
  FaPlus,
  FaReceipt,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { makeRequest } from "../../makeRequest";
import { resolveAssetUrl } from "../../config/env";
import "./AdminLayout.scss";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/admin/products", label: "Products", icon: <FaBoxOpen /> },
  { to: "/admin/products/new", label: "Add Product", icon: <FaPlus /> },
  { to: "/admin/reports", label: "Reports", icon: <FaChartLine /> },
  { to: "/admin/orders", label: "Orders", icon: <FaReceipt /> },
  { to: "/admin/customers", label: "Customers", icon: <FaUsers /> },
  { to: "/admin/settings", label: "Settings", icon: <FaCog /> },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState({ count: 0, items: [] });
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    const refreshUser = () => setUser(JSON.parse(localStorage.getItem("user") || "null"));
    window.addEventListener("storage", refreshUser);
    return () => window.removeEventListener("storage", refreshUser);
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/admin");
    }
  }, [navigate, user?.role]);

  useEffect(() => {
    if (user?.role !== "admin") return;

    makeRequest.get("/admin/notifications")
      .then((res) => setNotifications(res.data.data || { count: 0, items: [] }))
      .catch(() => setNotifications({ count: 0, items: [] }));
  }, [user?.role]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/admin");
  };

  return (
    <div className={`admin_shell ${collapsed ? "is_collapsed" : ""} ${mobileOpen ? "is_mobile_open" : ""}`}>
      <button className="admin_mobile_overlay" onClick={() => setMobileOpen(false)} aria-label="Close admin menu" />
      <aside className="admin_sidebar">
        <div className="admin_brand">
          <div>
            <strong>CircuitCart</strong>
            <span>Admin</span>
          </div>
          <button className="admin_collapse" onClick={() => setCollapsed((prev) => !prev)} aria-label="Collapse sidebar">
            <FaChevronLeft />
          </button>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin_sidebar_bottom">
          <NavLink to="/" onClick={() => setMobileOpen(false)}>
            <FaHome />
            <span>Storefront</span>
          </NavLink>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      <section className="admin_main">
        <header className="admin_topbar">
          <button className="admin_hamburger" onClick={() => setMobileOpen(true)} aria-label="Open admin menu">
            <FaBars />
          </button>
          <div className="admin_topbar_actions">
            <button className="admin_notification" title={notifications.items[0]?.title || "Notifications"}>
              <FaBell />
              {notifications.count > 0 && <span>{notifications.count}</span>}
            </button>
          </div>
          <div className="admin_identity">
            {user?.profileImage && <img src={resolveAssetUrl(user.profileImage)} alt={user.name || "Admin"} />}
            <span>Signed in as</span>
            <strong>{user?.email || "Admin"}</strong>
          </div>
        </header>
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;
