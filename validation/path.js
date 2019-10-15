const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePath(data) {
  let errors = {};

  data.bubblePath = !isEmpty(data.bubblePath) ? data.bubblePath : '';

  if (typeof data.bubblePath != 'object') {
    errors.bubblePath = 'Path has a wrong data type';
  }
  if (
    Validator.isEmpty(data.bubblePath) ||
    (data.bubblePath.length && data.bubblePath.length == 0)
  ) {
    errors.bubblePath = 'Path can not be empty';
  }
  if (data.bubblePath.length && data.bubblePath.length > 0) {
    for (let i = 0; i < data.bubblePath.length; i++) {
      if (
        data.bubblePath[i]._id == null ||
        data.bubblePath[i].title == null ||
        typeof data.bubblePath[i]._id != 'string' ||
        typeof data.bubblePath[i].title != 'string'
      ) {
        errors.bubblePath = 'Path contains errors';
      }
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
