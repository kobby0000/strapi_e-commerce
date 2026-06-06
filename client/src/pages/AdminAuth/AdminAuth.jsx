import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { GOOGLE_CLIENT_ID } from "../../config/env";
import { makeRequest } from "../../makeRequest";
import "./AdminAuth.scss";

const AdminAuth = () => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const finishAdminLogin = (data) => {
    if (data.user?.role !== "admin") {
      toast.error("This account does not have admin access.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("storage"));
    toast.success("Welcome to the admin dashboard.");
    navigate("/admin/dashboard");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "register" ? "/auth/admin/register" : "/auth/login";
      const payload =
        mode === "register"
          ? form
          : { email: form.email, password: form.password };

      const res = await makeRequest.post(endpoint, payload);

      finishAdminLogin(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Admin authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await makeRequest.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      finishAdminLogin(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Google login failed");
    }
  };

  return (
    <main className="admin_auth">
      <section className="admin_auth_panel">
        <div className="admin_auth_intro">
          <span>Admin Console</span>
          <h1>CircuitCart operations</h1>
          <p>Manage electronics inventory, monitor low stock and keep storefront data clean.</p>
        </div>

        <form onSubmit={onSubmit} className="admin_auth_form">
          <div className="admin_auth_tabs">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
              Register
            </button>
          </div>

          {mode === "register" && (
            <input name="name" value={form.name} onChange={onChange} placeholder="Admin name" required />
          )}
          <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Admin email" required />
          <input name="password" value={form.password} onChange={onChange} type="password" placeholder="Password" minLength={8} required />
          {mode === "register" && (
            <input name="confirmPassword" value={form.confirmPassword} onChange={onChange} type="password" placeholder="Confirm password" minLength={8} required />
          )}
          {mode === "register" && (
            <input name="inviteCode" value={form.inviteCode} onChange={onChange} placeholder="Invite code" required />
          )}

          <button className="admin_auth_submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "register" ? "Create admin" : "Open dashboard"}
          </button>

          {GOOGLE_CLIENT_ID && mode === "login" && (
            <div className="admin_google">
              <GoogleLogin onSuccess={onGoogleSuccess} onError={() => toast.error("Google login failed")} />
            </div>
          )}
        </form>
      </section>
    </main>
  );
};

export default AdminAuth;
