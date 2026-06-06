const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  const [customers, admins, products, carts, lowStock, recentProducts] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "admin" }),
    Product.countDocuments(),
    Cart.countDocuments(),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Product.find().sort("-createdAt").limit(6),
  ]);

  res.json({
    data: {
      metrics: {
        customers,
        admins,
        products,
        carts,
        lowStock,
      },
      recentProducts,
    },
  });
});

const getNotifications = asyncHandler(async (req, res) => {
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .sort("stock")
    .limit(5)
    .select("title stock category");

  const items = lowStockProducts.map((product) => ({
    id: product._id,
    type: "low_stock",
    title: `${product.title} is low on stock`,
    message: `${product.stock} units remaining in ${product.category}`,
  }));

  res.json({
    data: {
      count: items.length,
      items,
    },
  });
});

module.exports = { getDashboard, getNotifications };
