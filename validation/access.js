const Validator = require('validator');
const isEmpty = require('./is-empty');
const accessList = require('../common/accessList');

module.exports = function validateStatus(data) {
  let errors = {};

  data.access.type = !isEmpty(data.access.type) ? data.access.type : '';

  if (accessList.indexOf(data.access.type) == -1) {
    errors.access = 'Access is invalid';
  }
  if (Validator.isEmpty(data.access.type)) {
    errors.access = 'Access can not be empty';
  }
  if (data.access.type == 'team' && !data.access.id) {
    errors.access = 'Access team is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
