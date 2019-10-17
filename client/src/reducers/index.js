import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import responseReducer from './responseReducer';
import bubbleReducer from './bubbleReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  response: responseReducer,
  bubble: bubbleReducer
});
