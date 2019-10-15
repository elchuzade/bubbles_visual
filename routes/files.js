const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/keys');
const checkFileType = require('../validation/image');

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
});

const s3 = new aws.S3();

const uploadUserAvatar = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bubbles',
    acl: 'public-read',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      var newFileName = Date.now() + '-' + file.originalname;
      var fullPath = 'userAvatar/' + newFileName;
      cb(null, fullPath);
    }
  }),
  limits: { fileSize: 20000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

const uploadBubbleAvatar = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bubbles',
    acl: 'public-read',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      var newFileName = Date.now() + '-' + file.originalname;
      var fullPath = 'bubbleAvatar/' + newFileName;
      cb(null, fullPath);
    }
  }),
  limits: { fileSize: 20000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports.uploadUserAvatar = uploadUserAvatar;
module.exports.uploadBubbleAvatar = uploadBubbleAvatar;
