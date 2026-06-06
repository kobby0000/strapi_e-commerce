const express = require("express");

const {
  login,
  me,
  changePassword,
  forgotPassword,
  googleLogin,
  registerAdmin,
  registerCustomer,
  resendVerification,
  resetPassword,
  updateProfile,
  verifyEmail,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/admin/register", registerAdmin);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/resend-verification", resendVerification);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email/:token", verifyEmail);
router.get("/me", protect, me);
router.patch("/profile", protect, upload.single("profileImage"), updateProfile);
router.patch("/password", protect, changePassword);

module.exports = router;
