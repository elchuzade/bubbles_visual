const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateParent(data) {
  let errors = {};

  data._id = !isEmpty(data._id) ? data._id : '';
  data.title = !isEmpty(data.title) ? data.title : '';

  if (Validator.isEmpty(data._id)) {
    errors.parent = 'Parent id can not be empty';
  }
  if (Validator.isEmpty(data.title)) {
    errors.parent = 'Parent title can not be empty';
  }
  if (typeof data._id != 'string' || typeof data.title != 'string') {
    errors.parent = 'Parent contains errors';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
