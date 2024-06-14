import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/products");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const extension = file.originalname.split(".").pop();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("File yang diunggah harus berupa gambar (JPEG/PNG)"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Batasi ukuran file 5MB
  fileFilter: fileFilter,
});

export default upload;
