import { GET_RESPONSE } from '../actions/types';

const initialState = {
  action: false,
  message: null,
  item: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_RESPONSE:
      return {
        ...state,
        action: action.payload.action,
        message: action.payload.message,
        item: action.payload.item
      };
    default:
      return state;
  }
};
