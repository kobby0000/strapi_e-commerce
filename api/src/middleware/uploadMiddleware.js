const fs = require("fs");
const path = require("path");

const multer = require("multer");

const env = require("../config/env");

const uploadRoot = path.join(__dirname, "..", "..", "uploads");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = file.fieldname === "profileImage" ? "profiles" : "products";
    const target = path.join(uploadRoot, folder);
    ensureDir(target);
    cb(null, target);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "image";
    cb(null, `${Date.now()}-${safeBase}${ext}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image uploads are allowed"));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: env.UPLOAD_MAX_FILE_SIZE_BYTES,
  },
});

const fileUrl = (file) => {
  if (!file) return "";
  const relative = path.relative(uploadRoot, file.path).replace(/\\/g, "/");
  return `/uploads/${relative}`;
};

module.exports = {
  fileUrl,
  upload,
};
