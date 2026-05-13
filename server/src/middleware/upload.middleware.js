const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const pdfsDir = path.join(uploadsDir, 'pdfs');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('=== UPLOAD DESTINATION CALLED ===');
    console.log('Upload destination for field:', file.fieldname);
    console.log('File mimetype:', file.mimetype);
    console.log('File originalname:', file.originalname);

    if (['resumePdf', 'resumePDF'].includes(file.fieldname)) {
      console.log('Saving to pdfs dir:', pdfsDir);
      cb(null, pdfsDir);
    } else if (['image', 'profileImage'].includes(file.fieldname)) {
      console.log('Saving to images dir:', imagesDir);
      cb(null, imagesDir);
    } else {
      console.log('Saving to uploads dir:', uploadsDir);
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (['resumePdf', 'resumePDF'].includes(file.fieldname)) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed for resume'), false);
    }
  } else if (['image', 'profileImage'].includes(file.fieldname)) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed for profile'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;