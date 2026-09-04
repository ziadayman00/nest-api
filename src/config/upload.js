const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const AppError = require('../utils/app-error');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'nest/design-requests',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 2000, height: 2000, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new AppError('Only JPEG, PNG, and WebP images are allowed', 400));
    }

    return callback(null, true);
  },
});

module.exports = upload;
