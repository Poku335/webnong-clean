const express = require('express');
const router = express.Router();
const { authCheck } = require('../middlewares/authCheck');
const { 
  uploadSingle, 
  handleUpload, 
  uploadMultiple, 
  handleMultipleUpload 
} = require('../controllers/upload');

// Single file upload (for payment slips)
router.post('/upload/single', authCheck, uploadSingle, handleUpload);

// Multiple files upload
router.post('/upload/multiple', authCheck, uploadMultiple, handleMultipleUpload);

// Payment slip specific upload
router.post('/upload/payment-slip', authCheck, (req, res, next) => {
  // Set folder to payment-slips for this route
  req.body.folder = 'payment-slips';
  next();
}, uploadSingle, handleUpload);

module.exports = router;
