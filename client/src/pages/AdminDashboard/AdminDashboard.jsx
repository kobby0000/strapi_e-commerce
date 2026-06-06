import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { makeRequest } from "../../makeRequest";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await makeRequest.get("/admin/dashboard");
        setDashboard(res.data.data);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Please login as an admin.");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  if (loading) return <main className="admin_dashboard">Loading dashboard...</main>;

  const metrics = dashboard?.metrics || {};

  return (
    <main className="admin_dashboard admin_page">
      <div className="admin_dashboard_header">
        <div>
          <span>Store Admin</span>
          <h1>Electronics dashboard</h1>
        </div>
        <Link to="/products/laptops">View storefront</Link>
      </div>

      <section className="admin_metrics">
        <article><span>Products</span><strong>{metrics.products || 0}</strong></article>
        <article><span>Customers</span><strong>{metrics.customers || 0}</strong></article>
        <article><span>Carts</span><strong>{metrics.carts || 0}</strong></article>
        <article><span>Low stock</span><strong>{metrics.lowStock || 0}</strong></article>
      </section>

      <section className="admin_table">
        <h2>Recent inventory</h2>
        <div className="admin_table_rows">
          {(dashboard?.recentProducts || []).map((product) => (
            <div className="admin_table_row" key={product._id}>
              <img src={product.img} alt={product.title} />
              <div>
                <strong>{product.title}</strong>
                <span>{product.brand} · {product.category}</span>
              </div>
              <span>${product.price}</span>
              <span>{product.stock} in stock</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
