import { put, call, takeLatest, select } from "redux-saga/effects";
import {
  GET_USERS_SAGA,
  UPDATE_USER_ROLE_SAGA,
  GET_USERS_ROLES_SAGA,
  GET_USERS_REDUCER,
  UPDATE_USER_ROLE_REDUCER,
  GET_USERS_ROLES_REDUCER,
  RESET_PASSWORD_SAGA,
  UPLOAD_NEW_USER_SAGA,
  UPLOAD_NEW_USER_REDUCER,
  UPDATE_LOGGED_USER_REDUCER,
} from "../constant/users";
import { logoutAction } from '../actions/login';
import Axios from "axios";
import { usersUrl, userRolesUrl } from "../../utils/api";
import { checkAuthorization } from "../../utils/auth";
import { usersPageSize } from "../../static";

function* getUsersRequest(data: any) {
  try {
    const { filter, role, page, limit } = data.filters;
    const { auth } = yield select();
    const headers = { Authorization: `Bearer ${auth.auth_token}` };
    let URL = `${usersUrl}?limit=${limit || usersPageSize}`

    if (filter) {
      URL += `&filter=${filter}`;
    }

    if (role) {
      URL += `&role=${role}`;
    }

    if (page) {
      URL += `&page=${page}`;
    }

    const res = yield call(() => {
      return Axios.get(URL, {
        headers,
      });
    });

    yield put({ type: GET_USERS_REDUCER, data: res.data });
  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* getUsersRolesRequest() {
  try {
    const { auth } = yield select();
    const headers = { Authorization: `Bearer ${auth.auth_token}` };

    const res = yield call(() => {
      return Axios.get(userRolesUrl, {
        headers,
      });
    });

    yield put({ type: GET_USERS_ROLES_REDUCER, data: res.data });

  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* uploadNewUser(data: any) {
  try {
    yield put({type: UPLOAD_NEW_USER_REDUCER, data: data.data.data});
  } catch(error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* updateUserRoleRequest(data: any) {
  try {
    const { auth } = yield select();
    const {id, roleId, user, isSimple=false} = data.data
    if (!isSimple) {
      const headers = { Authorization: `Bearer ${auth.auth_token}` };
      const URL = `${usersUrl}/${id}/role`

      const res = yield call(() => {
        return Axios.patch(URL,
          {
            roleId
          },
          {
            headers,
          }
        );
      });

      yield put({ type: UPDATE_USER_ROLE_REDUCER, data: res.data });
    } else if (isSimple) {
      yield put({ type: UPDATE_USER_ROLE_REDUCER, data: user });
      if (auth.user.id === user.id) {
        yield put({type: UPDATE_LOGGED_USER_REDUCER, data: user});
      }
    }
        
  } catch (error) {
    console.log(error);
    if (error.request.status === 405) {
      alert('ALERT: Permission denied');
    }
  }
}

function* resetPasswordRequest(data: any) {
  try {
    const { auth } = yield select();
    const headers = { Authorization: `Bearer ${auth.auth_token}` };
    const {password} = data.data;

    yield call(() => {
      return Axios.patch(
        `${usersUrl}/reset`,
        {
          newPassword: password
        },
        {
          headers,
        }
      );
    });

    yield put(logoutAction())
  } catch (error) {
    console.log(error);
    if (error.request.status === 405) {
      alert('ALERT: Permission denied');
    }
  }
}

function* usersSagas() {
  yield takeLatest(GET_USERS_SAGA, getUsersRequest);
  yield takeLatest(GET_USERS_ROLES_SAGA, getUsersRolesRequest);
  yield takeLatest(UPDATE_USER_ROLE_SAGA, updateUserRoleRequest);
  yield takeLatest(RESET_PASSWORD_SAGA, resetPasswordRequest);
  yield takeLatest(UPLOAD_NEW_USER_SAGA, uploadNewUser);
}


export default usersSagas;
