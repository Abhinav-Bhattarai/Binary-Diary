import Crypto from "crypto-js";
import React from "react";

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

export const AsyncSignup = React.lazy(
  () => import("../../Components/LandingPage/SIgnup/signup")
);
export const AsyncLogin = React.lazy(
  () => import("../../Components/LandingPage/Login/login")
);

export const Decrypt = (Encryption: string) => {
  const bytes = Crypto.AES.decrypt(Encryption, "VJ02394JG0-0@!");
  // @ts-ignore
  const data = bytes.toString(Crypto.enc.Utf8);
  return JSON.parse(data);
};

export const Encrypt = (Encryption: object | string) => {
  const bytes = Crypto.AES.encrypt(
    JSON.stringify(Encryption),
    "VJ02394JG0-0@!"
  ).toString();
  return bytes;
};

export const ScrollToBottom = () => {
  const criteria = window.outerHeight + window.innerHeight / 2;
  if (criteria > 1030) {
    setTimeout(() => {
      window.scrollTo({ behavior: "smooth", top: 100 });
    }, 100);
  }
};
