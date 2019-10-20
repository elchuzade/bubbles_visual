import {
  GET_BUBBLE,
  GET_PAGE_BUBBLES,
  GET_USER_BUBBLES,
  BUBBLE_LOADING,
  UPDATE_POSITION,
  CREATE_BUBBLE
} from '../actions/types';

const initialState = {
  bubble: null,
  pageBubbles: null,
  userBubbles: null,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BUBBLE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PAGE_BUBBLES:
      return {
        ...state,
        pageBubbles: action.payload,
        loading: false
      };
    case GET_USER_BUBBLES:
      return {
        ...state,
        userBubbles: action.payload,
        loading: false
      };
    case GET_BUBBLE:
      return {
        ...state,
        bubble: action.payload,
        loading: false
      };
    case UPDATE_POSITION: {
      let updatedBubbles = state.pageBubbles;
      for (let i = 0; i < updatedBubbles; i++) {
        if (updatedBubbles[i]._id === action.payload._id) {
          updatedBubbles[i].position = action.payload.position;
          return {
            ...state,
            pageBubbles: updatedBubbles
          };
        }
      }
      return {
        ...state
      };
    }
    case CREATE_BUBBLE: {
      let updatedBubbles = state.bubbles;
      updatedBubbles.push(action.payload.item);
      return {
        ...state,
        pageBubbles: updatedBubbles
      };
    }
    default:
      return state;
  }
};
