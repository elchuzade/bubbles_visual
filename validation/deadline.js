const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateDeadline(data) {
  let errors = {};

  data.date = !isEmpty(data.date) ? data.date : '';

  // To validate iso Date string being a full date string
  let options = {
    strict: true
  };

  if (!Validator.isISO8601(data.date, options)) {
    errors.date = 'Deadline is invalid';
  }
  if (Validator.isEmpty(data.date)) {
    errors.date = 'Deadline can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
