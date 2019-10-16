const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePage(data) {
  let errors = {};

  data.page = !isEmpty(data.page) ? data.page : '';

  if (Validator.isEmpty(data.page)) {
    errors.page = 'Page can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
