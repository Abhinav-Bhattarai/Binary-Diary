import Crypto from "crypto-js";
import React from "react";
import { LoginError, SignupError } from "./interface";

// React lazy loading
export const AsyncSignup = React.lazy(
  () => import("../../Components/LandingPage/SIgnup/signup")
);
export const AsyncLogin = React.lazy(
  () => import("../../Components/LandingPage/Login/login")
);

// helper functions;
export const ScrollToBottom = () => {
  const criteria = window.outerHeight + window.innerHeight / 2;
  if (criteria > 1030) {
    setTimeout(() => {
      window.scrollTo({ behavior: "smooth", top: 100 });
    }, 100);
  }
};

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

export const DecryptandAddInLocalStorage = (EncryptedData: string) => {
  const { auth_token, username, id, UniqueID } = Decrypt(EncryptedData);
  localStorage.setItem("auth-token", auth_token);
  localStorage.setItem("username", username);
  localStorage.setItem("userID", id);
  localStorage.setItem("uid", UniqueID);
};

export const validateLoginForm = (
  login_username: string,
  login_password: string
): boolean => {
  if (
    login_username.length > 4 &&
    login_username.length < 16 &&
    login_password.length > 7
  )
    return true;
  return false;
};

export const validateSignupForm = (
  username: string,
  password: string,
  confirm: string,
  phone: string
): boolean => {
  if (
    username.length > 4 &&
    password === confirm &&
    password.length > 7 &&
    phone.length >= 10 &&
    username.length < 16
  ) {
    return true;
  }
  return false;
};

export const ValidateRegex = (password: string): boolean => {
  const number_regex = /[0-9]/;
  if (number_regex.exec(password)) {
    return true;
  }
  return false;
};

export const UsernameErrorCheck = (
  username: string,
  Reference: React.RefObject<HTMLInputElement>,
  error: LoginError | SignupError
) => {
  const dummy = { ...error };
  if (username.length < 5) {
    dummy.username_err = "Username length must be atleast 5";
    Reference.current && (Reference.current.style.border = "2px solid #ff385c");
    return dummy;
  } else if (username.length > 15) {
    dummy.username_err = "Username length must less than 15";
    Reference.current && (Reference.current.style.border = "2px solid #ff385c");
    return dummy;
  }
  return null;
};

export const PasswordErrorCheck = (
  password: string,
  confirm: string,
  Reference: React.RefObject<HTMLInputElement>,
  error: LoginError | SignupError
) => {
  const dummy = { ...error };
  if (password.length < 8) {
    dummy.password_err = "Password length must be atleast 8";
    Reference.current && (Reference.current.style.border = "2px solid #ff385c");
    return dummy
  } else if (confirm !== password) {
    // @ts-ignore
    dummy.confirm_err = "Passwords donot match";
    Reference.current && (Reference.current.style.border = "2px solid #ff385c");
    return dummy;
  }
  return null;
};