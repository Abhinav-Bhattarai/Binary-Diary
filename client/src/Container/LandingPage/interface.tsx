export interface POSTFETCH {
  auth_token: string;
  type: string;
  username: string;
  error: boolean;
  id: string;
  UniqueID: string;
  EncryptedData: string;
}

export interface LoginError {
  username_err: null | string;
  password_err: null | string;
  cred_err: null | string;
}

export interface SignupError {
  username_err: null | string;
  password_err: null | string;
  confirm_err: null | string;
  phone_err: null | string;
  cred_err: null | string;
}

export const initial_login_error: LoginError = {
  username_err: null,
  password_err: null,
  cred_err: null,
};

export const initial_signup_error: SignupError = {
  username_err: null,
  password_err: null,
  confirm_err: null,
  phone_err: null,
  cred_err: null,
};
