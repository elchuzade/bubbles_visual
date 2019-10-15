const Validator = require('validator');
const isEmpty = require('./is-empty');
const statusList = require('./');

module.exports = function validateStatus(data) {
  let errors = {};

  data.status = !isEmpty(data.status) ? data.status : '';

  if (data.status ) {
    errors.status = 'Status is invalid';
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
