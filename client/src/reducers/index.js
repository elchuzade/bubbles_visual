import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import responseReducer from './responseReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  response: responseReducer
});
