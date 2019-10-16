const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateParentPage(data, version) {
  let errors = {};

  data._id = !isEmpty(data._id) ? data._id : '';
  data.title = !isEmpty(data.title) ? data.title : '';

  if (Validator.isEmpty(data._id)) {
    if (version == 'page') {
      errors.page = 'Page id can not be empty';
    } else {
      errors.parent = 'Parent id can not be empty';
    }
  }
  if (Validator.isEmpty(data.title)) {
    if (version == 'page') {
      errors.page = 'Page title can not be empty';
    } else {
      errors.parent = 'Parent title can not be empty';
    }
  }
  if (typeof data._id != 'string' || typeof data.title != 'string') {
    if (version == 'page') {
      errors.page = 'Page contains errors';
    } else {
      errors.parent = 'Parent contains errors';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
