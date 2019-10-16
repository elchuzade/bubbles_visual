const express = require('express');
const router = express.Router();
const passport = require('passport');
const Bubble = require('../../models/Bubble');
const validateDeadline = require('../../validation/deadline');
const validateStatus = require('../../validation/status');
const validateImportance = require('../../validation/importance');
const validatePath = require('../../validation/path');
const validateAccess = require('../../validation/access');

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
    // if (!isValid) return res.status(400).json(errors);
    // Input Validation passed successfully, create a new bubble
    let access = {
      type: 'private'
    };
    let bubble = {
      title: 'title',
      access: access
      // bubblePath: req.body.path,
      // parent: req.body.bubblePath[req.body.bubblePath.length - 1]
    };
    new Bubble(bubble)
      .save()
      .then(bubble =>
        res.status(201).json({
          item: bubble,
          action: 'add',
          message: 'Added bubble'
        })
      )
      .catch(err => {
        errors.bubble = 'Bubble can not be saved';
        console.log(err);
        return res.status(400).json(errors);
      });
  }
);

// @route POST api/bubbles/:id
// @desc Update bubble info
router.post(
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
          .then(bubble =>
            res.status(201).json({
              item: bubble,
              action: 'update',
              message: 'Updated bubble'
            })
          )
          .catch(err => {
            errors.bubble = 'Bubble can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/bubbles/:id/status
// @desc Update bubble status
router.post(
  '/:id/status',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateStatus(req.body);
    if (!isValid) return res.status(400).json(errors);
    Bubble.findById(req.params.id)
      .then(bubble => {
        if (req.body.status) bubble.status = req.body.status;
        bubble
          .save()
          .then(bubble =>
            res.status(201).json({
              item: bubble,
              action: 'update',
              message: 'Updated bubble'
            })
          )
          .catch(err => {
            errors.bubble = 'Bubble can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/bubbles/:id/importance
// @desc Update bubble importance
router.post(
  '/:id/importance',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateImportance(req.body);
    if (!isValid) return res.status(400).json(errors);
    Bubble.findById(req.params.id)
      .then(bubble => {
        if (req.body.importance) bubble.importance = req.body.importance;
        bubble
          .save()
          .then(bubble =>
            res.status(201).json({
              item: bubble,
              action: 'update',
              message: 'Updated bubble'
            })
          )
          .catch(err => {
            errors.bubble = 'Bubble can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/bubbles/:id/deadline
// @desc Update bubble deadline
router.post(
  '/:id/deadline',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateDeadline(req.body);
    if (!isValid) return res.status(400).json(errors);
    Bubble.findById(req.params.id)
      .then(bubble => {
        if (req.body.deadline) bubble.deadline = req.body.deadline;
        bubble
          .save()
          .then(bubble =>
            res.status(201).json({
              item: bubble,
              action: 'update',
              message: 'Updated bubble'
            })
          )
          .catch(err => {
            errors.bubble = 'Bubble can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route Delete api/bubbles/:id/deadline
// @desc Delete bubble deadline
router.delete(
  '/:id/deadline',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bubble.findById(req.params.id)
      .then(bubble => {
        bubble.deadline = null;
        bubble
          .save()
          .then(bubble =>
            res.status(201).json({
              item: bubble,
              action: 'update',
              message: 'Updated bubble'
            })
          )
          .catch(err => {
            errors.bubble = 'Bubble can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route GET api/bubbles/:id/
// @desc Get full bubble info
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bubble.findById(req.params.id)
      .then(bubble => res.status(200).json(bubble))
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/bubbles/:id/avatar
// @desc Update bubble avatar
router.post(
  '/:id/avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bubble.findById(req.params.id)
      .then(bubble => {
        let params = {};
        if (bubble.avatar && bubble.avatar.key) {
          params = {
            Bucket: bubble.avatar.bucket,
            Delete: {
              Objects: [{ Key: bubble.avatar.key }]
            }
          };
        }
        if (params.Delete && params.Delete.Objects.length > 0) {
          s3.deleteObjects(params, (err, data) => {
            if (err) console.log(err);
          });
        }
        bubbleAvatar(req, res, err => {
          if (err) {
            console.log(err);
            errors.uploadfail = 'Failed to upload an image';
            return res.json(errors);
          }
          if (req.file == undefined) {
            console.log(err);
            errors.selectfail = 'No file selected';
            return res.json(errors);
          }
          bubble.avatar.location = req.file.location;
          bubble.avatar.key = req.file.key;
          bubble.avatar.bucket = req.file.bucket;
          bubble.avatar.originalname = req.file.originalname;
          bubble.avatar.mimetype = req.file.mimetype;
          bubble.avatar.size = req.file.size;
          bubble.avatar.fieldName = req.file.metadata.fieldName;
          bubble
            .save()
            .then(bubble => res.status(201).json(bubble))
            .catch(err => {
              console.log(err);
              errors.bubble = 'Bubble can not saved';
              return res.status(400).json(errors);
            });
        });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(400).json(errors);
      });
  }
);

// @route DELETE api/bubbles/:id/avatar
// @desc Delete bubble avatar
router.delete(
  '/:id/avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Bubble.findById(req.params.id)
      .then(bubble => {
        let params = {};
        if (bubble.avatar && bubble.avatar.key) {
          params = {
            Bucket: bubble.avatar.bucket,
            Delete: {
              Objects: [{ Key: bubble.avatar.key }]
            }
          };
        }
        if (params.Delete && params.Delete.Objects.length > 0) {
          s3.deleteObjects(params, (err, data) => {
            if (err) console.log(err);
            else {
              bubble.avatar = null;
              bubble
                .save()
                .then(bubble => res.status(201).json(bubble))
                .catch(err => {
                  console.log(err);
                  errors.bubble = 'Bubble can not saved';
                  return res.status(400).json(errors);
                });
            }
          });
        }
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(400).json(errors);
      });
  }
);

// @route POST api/bubbles/:id/access
// @desc Update bubble access
router.post(
  '/:id/access',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAccess(req.body);
    if (!isValid) return res.status(400).json(errors);

    Bubble.findById(req.params.id)
      .then(bubble => {
        if (req.body.access) bubble.access = req.body.access;
        bubble
          .save()
          .then(bubble =>
            res.status(201).json({
              item: bubble,
              action: 'update',
              message: 'Updated bubble'
            })
          )
          .catch(err => {
            errors.bubble = 'Bubble can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.bubble = 'Bubble not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

module.exports = router;
