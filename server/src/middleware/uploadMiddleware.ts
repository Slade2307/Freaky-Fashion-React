// server/src/middleware/uploadMiddleware.ts
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'product-images');
  },
  filename: (req, file, cb) => {
    // Extract the file extension, e.g. ".png"
    const ext = path.extname(file.originalname);

    // Extract the original base name, replacing spaces with underscores
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_');

    // Build date and time in "YYYY-MM-DD-HH.MM" format
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // e.g. "2025-03-14"
    const hours = String(now.getHours()).padStart(2, '0');   // "14"
    const minutes = String(now.getMinutes()).padStart(2, '0'); // "44"
    // Combine them as "2025-03-14-14.44"
    const dateTime = `${dateString}-${hours}.${minutes}`;

    // Final filename: "2025-03-14-14.44_nameOfFile.ext"
    cb(null, `${dateTime}_${baseName}${ext}`);
  },
});

const upload = multer({ storage });
export default upload;
