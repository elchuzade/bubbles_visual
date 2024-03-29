const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');
const Bubble = require('../../models/Bubble');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check for validation errors
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        permission: 1
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              let bubble = {
                title: user.name,
                importance: 100,
                status: 'main'
              };
              new Bubble(bubble)
                .save()
                .then(bubble => {
                  bubble.page = bubble._id;
                  bubble.parentPage = bubble._id;
                  bubble
                    .save()
                    .then(bubble => res.status(201).json(user))
                    .catch(err => {
                      errors.bubble = 'Bubble can not be saved';
                      console.log(err);
                      return res.status(400).json(errors);
                    });
                  return res.status(201).json(user);
                })
                .catch(err => {
                  errors.bubble = 'Bubble can not be saved';
                  console.log(err);
                  return res.status(400).json(errors);
                });
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check for validation errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    // Check password
    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = {
            id: user.id,
            name: user.name,
            permission: user.permission
          }; // jwt payload
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 * 12 * 1000 },
            (err, token) => {
              if (err) {
                console.log(err);
              } else {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      })
      .catch(err => console.log(err));
  });
});

module.exports = router;
