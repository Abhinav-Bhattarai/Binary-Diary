import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import LoadingPage from "../../Components/UI/LoadingPage/LoadingPage";
import { usePostRequest } from "../../Hooks/LandingPage";
import Crypto from "crypto-js";
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
interface PROPS {
  ChangeAuthentication: (type: boolean) => void;
}

const initial_login_error: LoginError = {
  username_err: null,
  password_err: null,
  cred_err: null,
};

const initial_signup_error: SignupError = {
  username_err: null,
  password_err: null,
  confirm_err: null,
  phone_err: null,
  cred_err: null,
};

const AsyncSignup = React.lazy(
  () => import("../../Components/LandingPage/SIgnup/signup")
);
const AsyncLogin = React.lazy(
  () => import("../../Components/LandingPage/Login/login")
);

export const Decrypt = (Encryption: string) => {
  const bytes = Crypto.AES.decrypt(Encryption, "VJ02394JG0-0@!");
  // @ts-ignore
  const data = bytes.toString(Crypto.enc.Utf8);
  return JSON.parse(data);
};

const Encrypt = (Encryption: object | string) => {
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

const LandingPage: React.FC<PROPS> = ({ ChangeAuthentication }) => {
  // states
  const [login_username, setLoginUsername] = useState<string>("");
  const [login_password, setLoginPassword] = useState<string>("");
  const [login_error, setLoginError] =
    useState<LoginError>(initial_login_error);
  const [signup_error, setSignupError] =
    useState<SignupError>(initial_signup_error);
  const [signup_username, setSignupUsername] = useState<string>("");
  const [signup_password, setSignupPassword] = useState<string>("");
  const [signup_confirm, setSingupConfirm] = useState<string>("");
  const [signup_phone, setSignupPhone] = useState<string>("");
  // refs
  const LoginUsernameRef = useRef<HTMLInputElement>(null);
  const LoginPasswordRef = useRef<HTMLInputElement>(null);
  const SignupUsernameRef = useRef<HTMLInputElement>(null);
  const SignupPasswordRef = useRef<HTMLInputElement>(null);
  const SignupConfirmRef = useRef<HTMLInputElement>(null);
  const SignupPhoneRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  const { SendPOSTRequest } = usePostRequest({
    onComplete: (data: POSTFETCH) => {
      const { EncryptedData } = data;
      const { auth_token, username, id, UniqueID } = Decrypt(EncryptedData);
      localStorage.setItem("auth-token", auth_token);
      localStorage.setItem("username", username);
      localStorage.setItem("userID", id);
      localStorage.setItem("uid", UniqueID);
      history.replace("/post");
      ChangeAuthentication(true);
    },

    onError: (err: POSTFETCH) => {
      if (err.type === "login") {
        LoginUsernameRef.current &&
          (LoginUsernameRef.current.style.border = "2px solid #ff385c");
        LoginPasswordRef.current &&
          (LoginPasswordRef.current.style.border = "2px solid #ff385c");
        const dummy = { ...login_error };
        dummy.cred_err = "Invalid Credentials !!";
        setLoginError(dummy);
      } else {
        SignupUsernameRef.current &&
          (SignupUsernameRef.current.style.border = "2px solid #ff385c");
        SignupPasswordRef.current &&
          (SignupPasswordRef.current.style.border = "2px solid #ff385c");
        const dummy = { ...signup_error };
        dummy.cred_err = "Username already taken !!";
        setSignupError(dummy);
      }
    },
  });

  const ChangeUsernameLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLoginUsername(value);
  };

  const ChangePasswordLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLoginPassword(value);
  };
  const ChangeUsernameSignup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSignupUsername(value);
  };
  const ChangePasswordSignup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSignupPassword(value);
  };
  const ChangeConfirmSignup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSingupConfirm(value);
  };
  const ChangePhoneSingup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSignupPhone(value);
  };

  const LoginFormSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (login_username.length > 4 && login_password.length > 7) {
      const number_regex = /[0-9]/;
      if (number_regex.exec(login_password)) {
        let context: any = {
          Username: login_username,
          Password: login_password,
        };
        context = Encrypt(context);
        SendPOSTRequest("/login", { ContextData: context });
      } else {
        const dummy = { ...login_error };
        dummy.password_err = "Password must contain a number";
        LoginUsernameRef.current &&
          (LoginUsernameRef.current.style.border = "2px solid #ff385c");
        setLoginError(dummy);
      }
    } else {
      if (login_username.length < 5) {
        const dummy = { ...login_error };
        dummy.username_err = "Username length must be atleast 5";
        LoginUsernameRef.current &&
          (LoginUsernameRef.current.style.border = "2px solid #ff385c");
        setLoginError(dummy);
      }
      if (login_password.length < 8) {
        const dummy = { ...login_error };
        dummy.password_err = "Password length must be atleast 8";
        LoginPasswordRef.current &&
          (LoginPasswordRef.current.style.border = "2px solid #ff385c");
        setLoginError(dummy);
      }
    }
  };

  useEffect(() => {
    ScrollToBottom();
  }, []);

  const SignupFormSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      signup_username.length > 4 &&
      signup_password === signup_confirm &&
      signup_password.length > 7 &&
      signup_phone.length >= 10
    ) {
      const number_regex = /[0-9]/;
      if (number_regex.exec(signup_password)) {
        let context: any = {
          Username: signup_username,
          Password: signup_password,
          Confirm: signup_confirm,
          Phone: signup_phone,
        };
        context = Encrypt(context);
        SendPOSTRequest("/signup", { ContextData: context });
      } else {
        const dummy = { ...signup_error };
        dummy.password_err = "Password must contain a number";
        SignupUsernameRef.current &&
          (SignupUsernameRef.current.style.border = "2px solid #ff385c");
        setSignupError(dummy);
      }
    } else {
      if (signup_username.length < 5) {
        const dummy = { ...signup_error };
        dummy.username_err = "Username length must be atleast 5";
        SignupUsernameRef.current &&
          (SignupUsernameRef.current.style.border = "2px solid #ff385c");
        setSignupError(dummy);
      }

      if (signup_password.length < 8) {
        const dummy = { ...signup_error };
        dummy.password_err = "Password length must be atleast 8";
        SignupPasswordRef.current &&
          (SignupPasswordRef.current.style.border = "2px solid #ff385c");
        setSignupError(dummy);
      } else if (signup_confirm !== signup_password) {
        const dummy = { ...signup_error };
        dummy.confirm_err = "Passwords donot match";
        SignupConfirmRef.current &&
          (SignupConfirmRef.current.style.border = "2px solid #ff385c");
        setSignupError(dummy);
      }

      if (signup_phone.length < 10) {
        const dummy = { ...signup_error };
        dummy.phone_err = "Phone number not found";
        SignupPhoneRef.current &&
          (SignupPhoneRef.current.style.border = "2px solid #ff385c");
        setSignupError(dummy);
      }
    }
  };

  return (
    <React.Fragment>
      <Switch>
        <Route
          exact
          path="/login"
          render={() => {
            return (
              <Suspense fallback={<LoadingPage />}>
                <AsyncLogin
                  username={login_username}
                  password={login_password}
                  changeUsername={ChangeUsernameLogin}
                  changePassword={ChangePasswordLogin}
                  Submit={LoginFormSubmitHandler}
                  Error={login_error}
                  UsernameRef={LoginUsernameRef}
                  PasswordRef={LoginPasswordRef}
                />
              </Suspense>
            );
          }}
        />
        <Route
          exact
          path="/signup"
          render={() => {
            return (
              <Suspense fallback={<LoadingPage />}>
                <AsyncSignup
                  username={signup_username}
                  password={signup_password}
                  confirm={signup_confirm}
                  phone={signup_phone}
                  changeUsername={ChangeUsernameSignup}
                  changePassword={ChangePasswordSignup}
                  changeConfirm={ChangeConfirmSignup}
                  changePhone={ChangePhoneSingup}
                  Submit={SignupFormSubmitHandler}
                  Error={signup_error}
                  UsernameRef={SignupUsernameRef}
                  PasswordRef={SignupPasswordRef}
                  ConfirmRef={SignupConfirmRef}
                  PhoneRef={SignupPhoneRef}
                />
              </Suspense>
            );
          }}
        />
        <Route
          render={() => {
            return (
              <Suspense fallback={<LoadingPage />}>
                <AsyncLogin
                  username={login_username}
                  password={login_password}
                  changeUsername={ChangeUsernameLogin}
                  changePassword={ChangePasswordLogin}
                  Submit={LoginFormSubmitHandler}
                  Error={login_error}
                  UsernameRef={LoginUsernameRef}
                  PasswordRef={LoginPasswordRef}
                />
              </Suspense>
            );
          }}
        />
      </Switch>
    </React.Fragment>
  );
};

export default LandingPage;
