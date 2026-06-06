const Product = require("../models/Product");
const { fileUrl } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildProductQuery = (query) => {
  const filter = {};

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.subCategory) filter.subCategory = { $in: String(query.subCategory).split(",") };
  if (query.maxPrice) filter.price = { $lte: Number(query.maxPrice) };
  if (query.search) {
    const safeSearch = escapeRegex(String(query.search).slice(0, 100));
    filter.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { brand: { $regex: safeSearch, $options: "i" } },
    ];
  }

  return filter;
};

const getProducts = asyncHandler(async (req, res) => {
  const sort = req.query.sort === "desc" ? "-price" : req.query.sort === "asc" ? "price" : "-createdAt";
  const limit = Math.min(Number(req.query.limit) || 24, 100);

  const products = await Product.find(buildProductQuery(req.query)).sort(sort).limit(limit);
  res.json({ data: products });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ data: product });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        subCategories: { $addToSet: "$subCategory" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    data: categories.map((item) => ({
      id: item._id,
      title: item._id,
      subCategories: item.subCategories.filter(Boolean).sort(),
      count: item.count,
    })),
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.files?.img?.[0]) payload.img = fileUrl(req.files.img[0]);
  if (req.files?.img2?.[0]) payload.img2 = fileUrl(req.files.img2[0]);
  if (!payload.img) {
    res.status(400);
    throw new Error("Primary product image is required");
  }

  if (typeof payload.specs === "string") {
    try {
      payload.specs = JSON.parse(payload.specs || "{}");
    } catch (error) {
      res.status(400);
      throw new Error("Specs must be valid JSON");
    }
  }

  payload.price = Number(payload.price);
  payload.stock = payload.stock === "" || payload.stock === undefined ? 0 : Number(payload.stock);
  if (payload.oldPrice === "" || payload.oldPrice === undefined) {
    delete payload.oldPrice;
  } else {
    payload.oldPrice = Number(payload.oldPrice);
  }

  if (payload.isNewProduct !== undefined) payload.isNewProduct = payload.isNewProduct === "true" || payload.isNewProduct === true;

  const product = await Product.create(payload);
  res.status(201).json({ data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(204).end();
});

module.exports = {
  createProduct,
  deleteProduct,
  getCategories,
  getProductById,
  getProducts,
  updateProduct,
};
