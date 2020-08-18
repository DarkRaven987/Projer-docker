import { put, call, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  SIGN_IN_REDUCER,
  LOGOUT_REDUCER,
  SIGN_IN_SAGA,
  SIGN_UP_SAGA,
  SAVE_TOKEN_SAGA,
  LOGOUT_SAGA,
  FORGOT_PASSWORD_SAGA,
  FORGOT_PASSWORD_CONFIRM_SAGA,
} from "../constant/login";
import {
  signin_url,
  signup_url,
  forgotPasswordRequestUrl,
  forgotPasswordConfirmUrl
} from "../../utils/api";
import { setLocalItem, deleteLocalItem } from "../../utils/utils";

function* signInRequest(data: any) {
  try {
    const body = {
      username: data.data.username,
      password: data.data.password,
    };
    const { goToHome } = data.data;
    const res = yield call(() => {
      return axios.post(signin_url, body);
    });

    yield put({ type: SIGN_IN_REDUCER, data: res.data });
    setLocalItem("accessToken", res.data.accessToken);
    setLocalItem("loggedUser", JSON.stringify(res.data.user));
    goToHome();
  } catch (error) {
    console.log(error);
    if (error.request.status === 401) {
      alert("Username or password is not valid!");
    }
  }
}

function* signUpRequest(data: any) {
  try {
    const body = {
      firstName: data.data.firstName,
      secondName: data.data.secondName,
      username: data.data.username,
      mail: data.data.email,
      password: data.data.password_first,
    };
    const { handleLoginMode } = data.data;
    const res = yield call(() => {
      return axios.post(signup_url, body);
    });

    if (res.status === 201) handleLoginMode("SignIn");
  } catch (error) {
    console.log(error);
    if (error.request.status === 409) {
      const message = JSON.parse(error.request.response).message;
      alert(message);
    }
  }
}

function* saveTokenRequest(data: any) {
  try {
    yield put({ type: SIGN_IN_REDUCER, data: data.data });
  } catch (error) {
    console.log(error);
  }
}

function* logoutRequest() {
  try {
    yield put({ type: LOGOUT_REDUCER });
    deleteLocalItem("accessToken");
    deleteLocalItem("loggedUser");
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
  }
}

function* forgotPasswordRequest(data: any) {
  try {
    const { email, handleReturnToLogin } = data.data;

    yield call(() => {
      return axios.post(forgotPasswordRequestUrl, {
        mail: email,
      });
    });

    handleReturnToLogin();
  } catch (error) {
    const errRes = JSON.parse(error.request.response);
    if (errRes) {
      alert(errRes.message);
    }
    console.log(error);
  }
}

function* forgotPasswordConfrimRequest(data: any) {
  try {
    const { token, mail, password, handleHoldedLoginRedirect } = data.data;

    yield call(() => {
      return axios.post(forgotPasswordConfirmUrl, {
        mail,
        token,
        password,
      });
    });

    handleHoldedLoginRedirect();
  } catch (error) {
    const errRes = JSON.parse(error.request.response);
    if (errRes) {
      alert(errRes.message);
    }
    console.log(error);
  }
}

function* loginSagas() {
  yield takeLatest(SIGN_IN_SAGA, signInRequest);
  yield takeLatest(SIGN_UP_SAGA, signUpRequest);
  yield takeLatest(SAVE_TOKEN_SAGA, saveTokenRequest);
  yield takeLatest(LOGOUT_SAGA, logoutRequest);
  yield takeLatest(FORGOT_PASSWORD_SAGA, forgotPasswordRequest);
  yield takeLatest(FORGOT_PASSWORD_CONFIRM_SAGA, forgotPasswordConfrimRequest);
}

export default loginSagas;
