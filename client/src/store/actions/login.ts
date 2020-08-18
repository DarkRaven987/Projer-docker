import {
  SIGN_IN_SAGA,
  SIGN_UP_SAGA,
  SAVE_TOKEN_SAGA,
  LOGOUT_SAGA,
  FORGOT_PASSWORD_SAGA,
  FORGOT_PASSWORD_CONFIRM_SAGA,
} from "../constant/login";

interface ISignIn {
  username: string;
  password: string;
}

interface ISignUp {
  firstName: string;
  secondName: string;
  username: string;
  password: string;
}

export const signInAction = (data: ISignIn) => ({
  type: SIGN_IN_SAGA,
  data,
});

export const saveTokenAction = (token: string) => ({
  type: SAVE_TOKEN_SAGA,
  data: token,
});

export const signUpAction = (data: ISignUp) => ({
  type: SIGN_UP_SAGA,
  data,
});

export const logoutAction = () => ({
  type: LOGOUT_SAGA,
});

export const resetPasswordRequestAction = (data: any) => ({
  type: FORGOT_PASSWORD_SAGA,
  data,
});

export const resetPasswordConfirmAction = (data: any) => ({
  type: FORGOT_PASSWORD_CONFIRM_SAGA,
  data
})