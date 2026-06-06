import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { makeRequest } from "../../makeRequest";
import "./VerifyEmail.scss";

const VerifyEmail = () => {
  const params = useParams();
  const token = useMemo(
    () => params.token || new URLSearchParams(window.location.search).get("token"),
    [params.token]
  );
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("Verification token is missing.");
      return;
    }

    makeRequest.post(`/auth/verify-email/${token}`)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("storage"));
        setStatus("Your email has been verified.");
        toast.success("Email verified.");
      })
      .catch((err) => {
        setStatus(err?.response?.data?.message || "Could not verify your email.");
      });
  }, [token]);

  return (
    <main className="verify_email">
      <section>
        <span>Verification</span>
        <h1>{status}</h1>
        <p>The backend validates the token and signs you in only after your email is confirmed.</p>
        <Link to="/">Go to storefront</Link>
      </section>
    </main>
  );
};

export default VerifyEmail;
