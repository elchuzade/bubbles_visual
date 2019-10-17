import axios from 'axios';

import {
  refreshErrors,
  refreshResponse,
  getError,
  getResponse,
  setLoading
} from './commonActions';

import { GET_BUBBLE, GET_BUBBLES } from './types';

export const getBubble = id => dispatch => {
  dispatch(setLoading('bubble'));
  refreshAll();
  axios
    .get(`/api/bubbles/${id}`)
    .then(res => {
      dispatch({
        type: GET_BUBBLE,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(getError(err.response.data));
    });
};

export const getPageBubbles = id => dispatch => {
  dispatch(setLoading('bubble'));
  refreshAll();
  axios
    .get(`/api/bubbles/${id}/page`)
    .then(res => {
      dispatch({
        type: GET_BUBBLES,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(getError(err.response.data));
    });
};

const refreshAll = () => dispatch => {
  dispatch(refreshErrors());
  dispatch(refreshResponse());
  dispatch(getResponse());
};
