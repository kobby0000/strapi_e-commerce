import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { resolveAssetUrl } from "../../config/env";
import { makeRequest } from "../../makeRequest";
import "./AdminSettings.scss";

const AdminSettings = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    profileImage: storedUser?.profileImage || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    makeRequest.get("/auth/me")
      .then((res) => {
        const user = res.data.user;
        setProfile({
          name: user.name || "",
          email: user.email || "",
          profileImage: user.profileImage || "",
        });
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));
      })
      .catch(() => {});
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", profile.name);
      if (profileImageFile) payload.append("profileImage", profileImageFile);

      const res = await makeRequest.patch("/auth/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setProfile((prev) => ({
        ...prev,
        profileImage: res.data.user.profileImage || "",
      }));
      setProfileImageFile(null);
      window.dispatchEvent(new Event("storage"));
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  const previewImage = useMemo(
    () => profileImageFile ? URL.createObjectURL(profileImageFile) : resolveAssetUrl(profile.profileImage),
    [profile.profileImage, profileImageFile]
  );

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await makeRequest.patch("/auth/password", passwordForm);
      setPasswordForm({ currentPassword: "", password: "", confirmPassword: "" });
      toast.success("Password updated.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin_settings admin_page">
      <div className="admin_page_header">
        <div>
          <span>System</span>
          <h1>Settings</h1>
        </div>
      </div>

      <section className="admin_panel">
        <div className="settings_tabs">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            User profile
          </button>
          <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
            Password reset
          </button>
        </div>

        {activeTab === "profile" ? (
          <form className="settings_form" onSubmit={updateProfile}>
            <div className="settings_avatar">
              {previewImage ? (
                <img src={previewImage} alt={profile.name || "Profile"} />
              ) : (
                <span>{(profile.name || "A").slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <label>
              Name
              <input
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input value={profile.email} disabled />
            </label>
            <label>
              Profile image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
              />
              {profileImageFile && <span className="settings_file_name">{profileImageFile.name}</span>}
            </label>
            <button disabled={loading}>{loading ? "Saving..." : "Save profile"}</button>
          </form>
        ) : (
          <form className="settings_form" onSubmit={updatePassword}>
            <label>
              Current password
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Required for password accounts"
              />
            </label>
            <label>
              New password
              <input
                type="password"
                minLength={8}
                value={passwordForm.password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                minLength={8}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </label>
            <button disabled={loading}>{loading ? "Saving..." : "Update password"}</button>
          </form>
        )}
      </section>
    </main>
  );
};

export default AdminSettings;
