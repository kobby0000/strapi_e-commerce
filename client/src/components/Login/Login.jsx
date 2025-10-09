import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Login.scss";

const Login = ({ setShowLogin }) => {
  const [mode, setMode] = useState("Login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base =
        (import.meta.env.VITE_APP_API_URL ||
          import.meta.env.VITE_API_URL ||
          "http://localhost:1337").replace(/\/$/, "");

      let url, payload;

      if (mode === "Login") {
        url = `${base}/auth/local`;
        payload = { identifier: form.email, password: form.password };
      } else {
        url = `${base}/auth/local/register`;
        payload = {
          username: form.name || form.email,
          email: form.email,
          password: form.password,
        };
      }

      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Auth response:", res.data);

      if (res.data.jwt) {
        localStorage.setItem("token", res.data.jwt);
        toast.success("Login successful!");
        window.dispatchEvent(new Event("storage"));
        setShowLogin(false);
      } else if (mode === "Sign Up") {
        toast.info("Account created. Please check your email to confirm before logging in.");
        setMode("Login");
      } else {
        toast.warn("Login succeeded but no token returned (unexpected). Check Strapi settings.");
      }
    } catch (err) {
      console.error("Auth error:", err.response || err.message);
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err.message ||
        "Unknown error";
      toast.error("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_popup">
      <form onSubmit={handleSubmit} className="login_popup_container">
        <div className="login_popup_title">
          <h2>{mode}</h2>
          <p onClick={() => setShowLogin(false)}>X</p>
        </div>

        <div className="login_popup_inputs">
          {mode === "Sign Up" && (
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              type="text"
              placeholder="Your Name"
              required
            />
          )}

          <input
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            placeholder="Your Email"
            required
          />
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className="login_popup_button" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        <div className="login_popup_condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {mode === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setMode("Sign Up")} className="login_change">
              Register
            </span>
            !
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setMode("Login")} className="login_change">
              Login
            </span>
            !
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
