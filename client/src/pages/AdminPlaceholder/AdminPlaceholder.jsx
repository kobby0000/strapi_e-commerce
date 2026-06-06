const AdminPlaceholder = ({ title, eyebrow }) => (
  <main className="admin_page">
    <div className="admin_page_header">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </div>
    </div>
    <section className="admin_panel">
      <p>This section is ready for the next admin workflow.</p>
    </section>
  </main>
);

export default AdminPlaceholder;
