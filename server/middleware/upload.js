import multer from "multer";
import path from "path";
import fs from "fs";

/* =====================================================
   UPLOAD DIRECTORY
===================================================== */

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "products"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* =====================================================
   STORAGE
===================================================== */

const storage =
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const extension =
        path.extname(file.originalname);

      const name =
        path
          .basename(
            file.originalname,
            extension
          )
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();

      cb(
        null,
        `${name}-${Date.now()}${extension}`
      );
    },
  });

/* =====================================================
   FILE FILTER
===================================================== */

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

/* =====================================================
   MULTER
===================================================== */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});

export default upload;