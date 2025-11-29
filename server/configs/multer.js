import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import fs from 'fs';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use the /tmp directory for uploads in serverless environments
const uploadsDir = join('/tmp', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Use /tmp/uploads as the destination
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/jpg', 'application/pdf',
    'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a'
  ];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.mp3', '.wav', '.m4a'];

  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and audio files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

export { upload };