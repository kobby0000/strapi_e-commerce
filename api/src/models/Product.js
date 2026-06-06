const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["laptops", "phones", "audio", "gaming", "accessories"],
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["featured", "trending", "new", "sale"],
      default: "featured",
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    img: {
      type: String,
      required: true,
    },
    img2: String,
    isNewProduct: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
