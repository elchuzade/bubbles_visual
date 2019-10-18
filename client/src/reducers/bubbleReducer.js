import {
  GET_BUBBLE,
  GET_BUBBLES,
  BUBBLE_LOADING,
  UPDATE_POSITION,
  CREATE_BUBBLE
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
    case UPDATE_POSITION: {
      let updatedBubbles = state.bubbles;
      for (let i = 0; i < updatedBubbles; i++) {
        if (updatedBubbles[i]._id === action.payload._id) {
          updatedBubbles[i].position = action.payload.position;
          return {
            ...state,
            bubbles: updatedBubbles
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
        bubbles: updatedBubbles
      };
    }
    default:
      return state;
  }
};
