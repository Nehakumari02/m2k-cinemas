const multer = require('multer');
const fs = require('fs');
const pathModule = require('path');

const storage = path =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const destination = pathModule.join('./uploads', path);
      fs.mkdirSync(destination, { recursive: true });
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const upload = path =>
  multer({
    storage: storage(path),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg, .jpeg and .webp format allowed!'));
      }
    },
  });

module.exports = upload;
