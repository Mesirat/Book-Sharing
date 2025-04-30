import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


export const uploadBookAssets = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      if (file.fieldname === "thumbnail") {
        return {
          folder: "book_thumbnails",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "gif"],
        };
      }
      if (file.fieldname === "pdf") {
        return {
          folder: "book_pdfs",
          resource_type: "raw",
          allowed_formats: ["pdf"],
        };
      }
      return { folder: "misc_uploads" };
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, 
});
