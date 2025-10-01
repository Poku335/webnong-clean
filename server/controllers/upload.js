const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const paymentSlipsDir = path.join(uploadsDir, 'payment-slips');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(paymentSlipsDir)) {
  fs.mkdirSync(paymentSlipsDir, { recursive: true });
}

// Configure multer storage for payment slips
const paymentSlipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, paymentSlipsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `payment-slip-${uniqueSuffix}${ext}`);
  }
});

// Configure multer storage for general uploads
const generalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const generalDir = path.join(uploadsDir, 'general');
    if (!fs.existsSync(generalDir)) {
      fs.mkdirSync(generalDir, { recursive: true });
    }
    cb(null, generalDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer for payment slips
const paymentSlipUpload = multer({
  storage: paymentSlipStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Initialize multer for general uploads
const generalUpload = multer({
  storage: generalStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload single file for payment slips
exports.uploadSingle = paymentSlipUpload.single('image');

// Upload single file for general uploads
exports.uploadSingleGeneral = generalUpload.single('image');

// Handle file upload
exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the file path relative to the uploads directory
    const filePath = `/uploads/payment-slips/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: filePath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

// Handle multiple file uploads
exports.uploadMultiple = generalUpload.array('images', 5); // Max 5 files

exports.handleMultipleUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const filePaths = req.files.map(file => ({
      filePath: `/uploads/${req.body.folder || 'general'}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      files: filePaths
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};
