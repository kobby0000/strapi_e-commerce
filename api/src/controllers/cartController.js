const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const serializeCart = async (cart) => {
  await cart.populate("items.product");

  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      id: item.product._id,
      title: item.product.title,
      desc: item.product.desc,
      price: item.product.price,
      img: item.product.img,
      quantity: item.quantity,
    }));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: cart._id,
    items,
    total,
  };
};

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.json({ data: { items: [], total: 0 } });
  }

  return res.json({ data: await serializeCart(cart) });
});

const upsertCart = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const productIds = items.map((item) => item.product || item.id);

  const foundProducts = await Product.find({ _id: { $in: productIds } }).select("_id");
  const validIds = new Set(foundProducts.map((product) => product._id.toString()));

  const sanitizedItems = items
    .map((item) => ({
      product: item.product || item.id,
      quantity: Math.max(Number(item.quantity) || 1, 1),
    }))
    .filter((item) => validIds.has(String(item.product)));

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: sanitizedItems } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ data: await serializeCart(cart) });
});

module.exports = {
  getCart,
  upsertCart,
};
