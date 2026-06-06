const express = require("express");

const { getDashboard, getNotifications } = require("../controllers/adminController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, requireAdmin, getDashboard);
router.get("/notifications", protect, requireAdmin, getNotifications);

module.exports = router;
