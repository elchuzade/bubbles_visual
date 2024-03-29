import { GET_ERRORS, GET_RESPONSE, BUBBLE_LOADING } from './types';

export const refreshErrors = () => {
  return {
    type: GET_ERRORS,
    payload: {}
  };
};

export const refreshResponse = () => {
  return {
    type: GET_RESPONSE,
    payload: {}
  };
};

export const getError = data => {
  return {
    type: GET_ERRORS,
    payload: data
  };
};

export const getResponse = data => {
  return {
    type: GET_RESPONSE,
    payload: data
  };
};

export const setLoading = data => {
  switch (data) {
    case 'bubble': {
      return {
        type: BUBBLE_LOADING
      };
    }
    default:
      return;
  }
};
