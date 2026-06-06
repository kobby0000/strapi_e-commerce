import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { makeRequest } from "../../makeRequest";

const AdminReports = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    makeRequest.get("/admin/dashboard")
      .then((res) => setMetrics(res.data.data.metrics))
      .catch((err) => toast.error(err?.response?.data?.message || "Could not load reports"));
  }, []);

  return (
    <main className="admin_page">
      <div className="admin_page_header">
        <div>
          <span>Insights</span>
          <h1>Reports</h1>
        </div>
      </div>
      <section className="admin_metrics">
        <article><span>Total products</span><strong>{metrics?.products || 0}</strong></article>
        <article><span>Customers</span><strong>{metrics?.customers || 0}</strong></article>
        <article><span>Open carts</span><strong>{metrics?.carts || 0}</strong></article>
        <article><span>Low stock</span><strong>{metrics?.lowStock || 0}</strong></article>
      </section>
    </main>
  );
};

export default AdminReports;
