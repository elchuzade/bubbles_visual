const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePosition(data) {
  let errors = {};

  data.x = !isEmpty(data.x) ? data.x.toString() : '';
  data.y = !isEmpty(data.y) ? data.y.toString() : '';

  let options = {
    min: 0,
    max: 100,
    allow_leading_zeroes: false
  };
  if (!Validator.isFloat(data.x, options) || !Validator.isFloat(data.y, options)) {
    errors.position = 'Position is invalid';
  }
  if (Validator.isEmpty(data.x)) {
    errors.position = 'Position X can not be empty';
  }
  if (Validator.isEmpty(data.y)) {
    errors.position = 'Position Y can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
