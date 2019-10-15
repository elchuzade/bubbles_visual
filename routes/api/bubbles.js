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

    // if (!isValid) return res.status(400).json(errors);

    // Input Validation passed successfully, create a new bubble
    let bubble = {
      title: 'title'
      // bubblePath: req.body.path,
      // parent: req.body.bubblePath[req.body.bubblePath.length - 1]
    };
    new Bubble(bubble)
      .save()
      .then(bubble => {
        return res.status(201).json({
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

// @route PUT api/bubbles/:id
// @desc Update bubble info
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bubble.findById(req.params.id)
      .then(bubble => {
        if (bubble.status == 'main') {
          errors.bubble = 'Can not modify main bubble';
          return res.status(400).json(errors);
        }
        if (req.body.title) bubble.title = req.body.title;
        if (req.body.info) bubble.info = req.body.info;
        bubble
          .save()
          .then(bubble => {
            return res.status(201).json({
              item: bubble,
              action: 'update',
              message: 'Updated bubble'
            });
          })
          .catch(err => {
            errors.bubble = 'Bubble can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        res.status(404).json(errors);
      });
  }
);

module.exports = router;
