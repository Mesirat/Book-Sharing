import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to create multer instance with dynamic upload directory
const createUpload = (uploadSubDir) => {
  const uploadDir = path.join(__dirname, '..', 'uploads', uploadSubDir);

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Set storage configuration for multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Use the directory passed into the function
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
    },
  });

  // File filter to allow only certain image types
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/i;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true); // Allow file
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!')); // Reject file with error
    }
  };

  // Return multer instance with storage, fileFilter, and file size limit
  return multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
  });
};

export default createUpload;
