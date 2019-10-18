import axios from 'axios';

import {
  refreshErrors,
  refreshResponse,
  getError,
  getResponse,
  setLoading
} from './commonActions';

import { GET_BUBBLE, GET_BUBBLES, UPDATE_POSITION } from './types';

const refreshAll = () => dispatch => {
  dispatch(refreshErrors());
  dispatch(refreshResponse());
  dispatch(getResponse());
};

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

export const updatePosition = (id, position) => dispatch => {
  refreshAll();
  axios
    .post(`/api/bubbles/${id}/position`, position)
    .then(res => {
      dispatch({
        type: UPDATE_POSITION,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(getError(err.response.data));
    });
};

