const express = require("express");

const { getCart, upsertCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.put("/", protect, upsertCart);

module.exports = router;
