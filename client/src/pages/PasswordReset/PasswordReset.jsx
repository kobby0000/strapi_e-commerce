import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { makeRequest } from "../../makeRequest";
import "./PasswordReset.scss";

const PasswordReset = () => {
  const params = useParams();
  const token = useMemo(
    () => params.token || new URLSearchParams(window.location.search).get("token"),
    [params.token]
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");

  const requestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDevResetUrl("");

    try {
      const res = await makeRequest.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      if (res.data.resetUrl) {
        setDevResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not request password reset");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await makeRequest.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));
      toast.success("Password reset successfully.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="password_reset">
      <section className="password_reset_panel">
        <div>
          <span>Account Recovery</span>
          <h1>{token ? "Set a new password" : "Forgot password"}</h1>
          <p>
            {token
              ? "Choose a new password. The API verifies the reset token and confirms both passwords match."
              : "Enter your account email and the API will generate a reset link when the account exists."}
          </p>
        </div>

        {token ? (
          <form onSubmit={resetPassword}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              minLength={8}
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={8}
              required
            />
            <button disabled={loading}>{loading ? "Saving..." : "Reset password"}</button>
          </form>
        ) : (
          <form onSubmit={requestReset}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Account email"
              required
            />
            <button disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
            {devResetUrl && (
              <Link className="password_reset_dev_link" to={new URL(devResetUrl).pathname + new URL(devResetUrl).search}>
                Open development reset link
              </Link>
            )}
          </form>
        )}
      </section>
    </main>
  );
};

export default PasswordReset;
