const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadPdf, uploadWebsite, uploadYoutube } = require('../controllers/uploadController');

const router = express.Router();

// Multer config: disk storage for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are accepted.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

router.post('/pdf', upload.single('pdf'), uploadPdf);
router.post('/website', uploadWebsite);
router.post('/youtube', uploadYoutube);

module.exports = router;
