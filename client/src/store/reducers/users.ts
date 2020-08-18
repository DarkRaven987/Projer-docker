import {
  GET_USERS_REDUCER,
  UPDATE_USER_ROLE_REDUCER,
  GET_USERS_ROLES_REDUCER,
  UPLOAD_NEW_USER_REDUCER,
} from "../constant/users";

const initState = {
  users: [],
  totalCount: 0,
  pages: 1,
  roles: [],
};

const usersReducer = (
  state = initState,
  action: {
    type: string;
    data?: any;
  }
) => {
  switch (action.type) {
    case GET_USERS_REDUCER:
      return {
        ...state,
        users: [...action.data.users],
        totalCount: action.data.totalCount,
        pages: action.data.pages
      };
    case UPLOAD_NEW_USER_REDUCER: 
      return {
        ...state,
        users: [...state.users, action.data]
      };
    case UPDATE_USER_ROLE_REDUCER:
      return {
        ...state,
        users: state.users.map((user: any) => {
          if (user.id === action.data.id) {
            return action.data
          }
          return user;
        })
      }
    case GET_USERS_ROLES_REDUCER:
      return {
        ...state,
        roles: [...action.data],
      };
    default:
      return {
        ...state,
      };
  }
};

export default usersReducer;
