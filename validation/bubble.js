const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateBubble(data) {
  let errors = {};

  data.parent._id = !isEmpty(data.parent._id) ? data.parent._id : '';
  data.parent.title = !isEmpty(data.parent.title) ? data.parent.title : '';

  if (typeof data.parent != 'object') {
    errors.parent = 'Parent has a wrong data type';
  }
  if (
    data.parent._id == null ||
    data.parent.title == null ||
    typeof data.parent._id != 'string' ||
    typeof data.parent.title != 'string'
  ) {
    errors.parent = 'Parent contains errors';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
