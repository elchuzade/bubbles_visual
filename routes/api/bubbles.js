const express = require('express');
const router = express.Router();
const passport = require('passport');
const Bubble = require('../../models/Bubble');
// const validateBlogInput = require('../../validation/blog');

// AWS IMAGES
const aws = require('aws-sdk');
const config = require('../../config/keys');
const upload = require('../files');
const bubbleAvatar = upload.uploadBubbleAvatar.single('blogAvatar');

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
});

const s3 = new aws.S3();



module.exports = router;
