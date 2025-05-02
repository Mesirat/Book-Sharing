import multer from "multer";

import dotenv from "dotenv";
dotenv.config();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });
  
export const uploadCSV = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "text/csv") {
        cb(null, true);
      } else {
        cb(new Error("Only CSV files are allowed!"), false);
      }
    },
  });
  