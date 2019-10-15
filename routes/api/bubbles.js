const express = require('express');
const router = express.Router();
const passport = require('passport');
const Bubble = require('../../models/Bubble');
const validateDeadline = require('../../validation/deadline');
const validateStatus = require('../../validation/status');
const validateImportance = require('../../validation/importance');
const validatePath = require('../../validation/path');

// AWS IMAGES
const aws = require('aws-sdk');
const config = require('../../config/keys');
const upload = require('../files');
const bubbleAvatar = upload.uploadBubbleAvatar.single('bubbleAvatar');

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
});

const s3 = new aws.S3();

// @route POST api/bubbles/
// @desc Create new bubble
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePath(req.body);
    console.log(req.body.bubblePath);

    if (!isValid) return res.status(400).json(errors);

    // Input Validation passed successfully, create a new bubble
    let bubble = {
      title: 'title',
      bubblePath: req.body.path,
      parent: req.body.bubblePath[req.body.bubblePath.length - 1]
    };
    new Bubble(bubble)
      .save()
      .then(bubble => {
        res.status(201).json({
          item: bubble,
          action: 'add',
          message: 'Added bubble'
        });
      })
      .catch(err => {
        errors.bubble = 'Bubble can not be saved';
        console.log(err);
        return res.status(400).json(errors);
      });
  }
);

module.exports = router;
