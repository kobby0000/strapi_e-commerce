require("dotenv").config();

const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");
const User = require("../src/models/User");

const products = [
  {
    title: "VoltBook Pro 14",
    desc: "Lightweight aluminum laptop with a 14-inch display, 16GB RAM and fast NVMe storage.",
    price: 1299,
    oldPrice: 1499,
    category: "laptops",
    subCategory: "ultrabooks",
    brand: "Volt",
    type: "featured",
    stock: 12,
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    img2: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    isNewProduct: true,
    specs: { memory: "16GB", storage: "1TB SSD", display: "14 inch" },
  },
  {
    title: "PixelWave X1 Smartphone",
    desc: "5G smartphone with a bright OLED display, all-day battery and pro-grade camera system.",
    price: 899,
    oldPrice: 999,
    category: "phones",
    subCategory: "smartphones",
    brand: "PixelWave",
    type: "trending",
    stock: 24,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    img2: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    isNewProduct: true,
    specs: { network: "5G", storage: "256GB", display: "OLED" },
  },
  {
    title: "SonicPods Max",
    desc: "Wireless noise-cancelling headphones tuned for commuting, work calls and high-resolution music.",
    price: 249,
    oldPrice: 319,
    category: "audio",
    subCategory: "headphones",
    brand: "Sonic",
    type: "featured",
    stock: 36,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    img2: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
    specs: { battery: "40 hours", mode: "ANC", connectivity: "Bluetooth 5.3" },
  },
  {
    title: "NovaDesk 32 4K Monitor",
    desc: "Color-accurate 32-inch 4K display with USB-C power delivery for modern workstations.",
    price: 549,
    oldPrice: 649,
    category: "accessories",
    subCategory: "monitors",
    brand: "NovaDesk",
    type: "trending",
    stock: 9,
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    img2: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80",
    specs: { resolution: "4K", size: "32 inch", input: "USB-C" },
  },
  {
    title: "AeroGame Console",
    desc: "Next-generation console with fast load times, ray-traced graphics and a wireless controller.",
    price: 499,
    oldPrice: 559,
    category: "gaming",
    subCategory: "consoles",
    brand: "AeroGame",
    type: "sale",
    stock: 18,
    img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
    img2: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
    specs: { storage: "1TB", output: "4K HDR", controller: "Wireless" },
  },
  {
    title: "ChargeDock Trio",
    desc: "Compact charging dock for phone, watch and earbuds with over-current protection.",
    price: 89,
    oldPrice: 119,
    category: "accessories",
    subCategory: "chargers",
    brand: "ChargeDock",
    type: "new",
    stock: 42,
    img: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=900&q=80",
    img2: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=900&q=80",
    isNewProduct: true,
    specs: { ports: "3 devices", power: "30W", protection: "Over-current" },
  },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany({});
  await Product.insertMany(products);

  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const admin = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL.toLowerCase() });
    if (!admin) {
      await User.create({
        name: process.env.SEED_ADMIN_NAME || "Store Admin",
        email: process.env.SEED_ADMIN_EMAIL,
        password: process.env.SEED_ADMIN_PASSWORD,
        role: "admin",
        emailVerified: true,
      });
    }
  }

  console.log(`Seeded ${products.length} electronics products`);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
