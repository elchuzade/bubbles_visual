const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateDeadline(data) {
  let errors = {};

  data.deadline = !isEmpty(data.deadline) ? data.deadline : '';

  // To validate iso Date string being a full date string
  let options = {
    strict: true
  };

  if (!Validator.isISO8601(data.deadline, options)) {
    errors.deadline = 'Deadline is invalid';
  }
  if (Validator.isEmpty(data.deadline)) {
    errors.deadline = 'Deadline can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
