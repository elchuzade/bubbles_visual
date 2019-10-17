import {
  GET_BUBBLE,
  GET_BUBBLES,
  BUBBLE_LOADING
} from '../actions/types';

const initialState = {
  bubble: null,
  bubbles: null,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BUBBLE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_BUBBLES:
      return {
        ...state,
        bubbles: action.payload,
        loading: false
      };
    case GET_BUBBLE:
      return {
        ...state,
        bubble: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
