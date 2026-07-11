import multer from 'multer';
import path from 'path';
import os from 'os';

// Use the OS temporary directory (works in serverless environments like Vercel)
const uploadsDir = os.tmpdir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

function csvFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.csv') {
    cb(null, true);
  } else {
    cb(new Error('Only .csv files are allowed'));
  }
}

export const upload = multer({
  storage,
  fileFilter: csvFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});
