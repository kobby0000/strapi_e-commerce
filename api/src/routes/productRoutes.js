const express = require("express");

const {
  createProduct,
  deleteProduct,
  getCategories,
  getProductById,
  getProducts,
  updateProduct,
} = require("../controllers/productController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  requireAdmin,
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "img2", maxCount: 1 },
  ]),
  createProduct
);
router.put("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;
