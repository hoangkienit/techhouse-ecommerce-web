import multer from "multer";

class UploadMiddleware {
  static upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb: any) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Chỉ chấp nhận ảnh JPG, JPEG hoặc PNG!"), false);
      }
      cb(null, true);
    },
  });
}

export default UploadMiddleware;
