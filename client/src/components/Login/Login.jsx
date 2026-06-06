import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { GOOGLE_CLIENT_ID } from "../../config/env";
import { makeRequest } from "../../makeRequest";
import "./Login.scss";

const Login = ({ setShowLogin }) => {
  const [mode, setMode] = useState("Login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint, payload;

      if (mode === "Login") {
        endpoint = "/auth/login";
        payload = { email: form.email, password: form.password };
      } else {
        endpoint = "/auth/register";
        payload = {
          name: form.name || form.email,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        };
      }

      const res = await makeRequest.post(endpoint, payload);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(mode === "Login" ? "Login successful!" : "Account created!");
        window.dispatchEvent(new Event("storage"));
        setShowLogin(false);
      } else if (res.data.message) {
        toast.success(res.data.message);
        setVerificationUrl(res.data.verificationUrl || "");
      } else {
        toast.warn("Authentication succeeded but no token was returned.");
      }
    } catch (err) {
      console.error("Auth error:", err.response || err.message);
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Unknown error";
      toast.error("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await makeRequest.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));
      toast.success("Google login successful!");
      setShowLogin(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="login_popup">
      <form onSubmit={handleSubmit} className="login_popup_container">
        <div className="login_popup_title">
          <h2>{mode}</h2>
          <button type="button" onClick={() => setShowLogin(false)}>X</button>
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
          {mode === "Sign Up" && (
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              type="password"
              placeholder="Confirm Password"
              required
            />
          )}
        </div>

        <button type="submit" className="login_popup_button" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        {GOOGLE_CLIENT_ID && mode === "Login" && (
          <div className="login_google">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} />
          </div>
        )}

        {verificationUrl && (
          <Link className="login_verify_link" to={new URL(verificationUrl).pathname + new URL(verificationUrl).search} onClick={() => setShowLogin(false)}>
            Open development verification link
          </Link>
        )}

        <div className="login_popup_condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {mode === "Login" ? (
          <>
            <p>
              <Link to="/password-reset" onClick={() => setShowLogin(false)} className="login_change">
                Forgot password?
              </Link>
            </p>
            <p>
              Create a new account?{" "}
              <span onClick={() => setMode("Sign Up")} className="login_change">
                Register
              </span>
              !
            </p>
          </>
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
