import React from "react";
import { LoginError, SignupError } from "../../../Container/LandingPage/interface";

export interface FORMINPUT {
  value: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: "text" | "password";
  name: string;
  Reference: React.RefObject<HTMLInputElement>;
}

export interface FORMLABEL {
  name: string;
  html_for: string;
}


export interface SignupProps {
  username: string;
  password: string;
  confirm: string;
  phone: string;
  Submit: (event: React.FormEvent) => void;
  changeUsername: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeConfirm: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changePhone: (event: React.ChangeEvent<HTMLInputElement>) => void;
  Error: SignupError;
  UsernameRef: React.RefObject<HTMLInputElement>;
  PasswordRef: React.RefObject<HTMLInputElement>;
  ConfirmRef: React.RefObject<HTMLInputElement>;
  PhoneRef: React.RefObject<HTMLInputElement>;
}
export interface LoginProps {
  username: string;
  password: string;
  Submit: (event: React.FormEvent) => void;
  changeUsername: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  Error: LoginError;
  UsernameRef: React.RefObject<HTMLInputElement>;
  PasswordRef: React.RefObject<HTMLInputElement>;
}

export interface FORM {
  Submit: (event: React.FormEvent) => void;
}

export interface BUTTON {
  name: "Login" | "Signup" | "Forgot Password";
}

export interface HEADER {
  name: "Signup" | "Login";
}

export interface ROUTERBUTTON {
  name: string;
  Change: () => void;
}

export interface LOGO {
    url: string;
}