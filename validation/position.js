const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePosition(data) {
  let errors = {};

  data.position.x = !isEmpty(data.position.x) ? data.position.x : '';
  data.position.y = !isEmpty(data.position.y) ? data.position.y : '';

  let options = {
    min: 0,
    max: 100,
    allow_leading_zeroes: false
  };
  if (
    !Validator.isInt(data.position.x, options) ||
    !Validator.isInt(data.position.y, options)
  ) {
    errors.position = 'Position is invalid';
  }
  if (Validator.isEmpty(data.position.x)) {
    errors.position = 'Position X can not be empty';
  }
  if (Validator.isEmpty(data.position.y)) {
    errors.position = 'Position Y can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
