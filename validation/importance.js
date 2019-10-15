const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateImportance(data) {
  let errors = {};

  data.importance = !isEmpty(data.importance) ? data.importance : '';

  let options = {
    min: 20,
    max: 80,
    allow_leading_zeroes: false
  };

  if (!Validator.isInt(data.importance, options)) {
    errors.importance = 'Importance is invalid';
  }
  if (Validator.isEmpty(data.importance)) {
    errors.importance = 'Importance can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
