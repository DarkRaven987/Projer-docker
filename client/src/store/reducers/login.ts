import { SIGN_IN_REDUCER, LOGOUT_REDUCER } from "../constant/login";
import {UPDATE_LOGGED_USER_REDUCER} from '../constant/users';
import { getLocalItem } from '../../utils/utils';

const initState = {
  auth_token: getLocalItem('accessToken') || null,
  user: JSON.parse(`${getLocalItem('loggedUser')}`) || {}
};

const loginReducer = (
  state = initState,
  action: {
    type: string;
    data: any;
  }
) => {
  switch (action.type) {
    case SIGN_IN_REDUCER:
      return {
        ...state,
        auth_token: action.data.accessToken,
        user: action.data.user
      };
    case LOGOUT_REDUCER:
      return {
        ...state, 
        auth_token: null,
        user: {}
      }
    case UPDATE_LOGGED_USER_REDUCER: 
      return {
        ...state,
        user: action.data
      }
    default:
      return {
        ...state,
      };
  }
};

export default loginReducer;