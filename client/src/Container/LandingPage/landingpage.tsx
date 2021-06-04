import React, { Suspense, useRef, useState } from "react";
import { Route, Switch } from "react-router";
import LoadingPage from "../../Components/UI/LoadingPage/LoadingPage";
import { usePostRequest } from "../../Hooks/LandingPage";
export interface POSTFETCH {
  auth_token: string;
};

export interface LoginError {
  username_err: null | string;
  password_err: null | string;
};

export interface SignupError {
  username_err: null | string;
  password_err: null | string;
  confirm_err: null | string;
  phone_err: null | string;
}
interface PROPS {
  ChangeAuthentication: (type: boolean) => void;
};

const initial_login_error: LoginError = {
  username_err: null,
  password_err: null
}

const initial_signup_error: SignupError = {
  username_err: null,
  password_err: null,

  confirm_err: null,
  phone_err: null
}

const AsyncSignup = React.lazy(
  () => import("../../Components/LandingPage/SIgnup/signup")
);
const AsyncLogin = React.lazy(
  () => import("../../Components/LandingPage/Login/login")
);

const LandingPage: React.FC<PROPS> = ({ ChangeAuthentication }) => {
  const [login_username, setLoginUsername] = useState<string>("");
  const [login_password, setLoginPassword] = useState<string>("");
  const [login_error, setLoginError] = useState<LoginError>(initial_login_error);
  const [signup_error, setSignupError] = useState<SignupError>(initial_signup_error);
  const [signup_username, setSignupUsername] = useState<string>("");
  const [signup_password, setSignupPassword] = useState<string>("");
  const [signup_confirm, setSingupConfirm] = useState<string>("");
  const [signup_phone, setSignupPhone] = useState<string>("");
  const LoginUsernameRef = useRef<HTMLInputElement>(null);
  const LoginPasswordRef = useRef<HTMLInputElement>(null);
  const SignupUsernameRef = useRef<HTMLInputElement>(null);
  const SignupPasswordRef = useRef<HTMLInputElement>(null);
  const SignupConfirmRef = useRef<HTMLInputElement>(null);
  const SignupPhoneRef = useRef<HTMLInputElement>(null);

  const { SendPOSTRequest } = usePostRequest({
    onComplete: (data: POSTFETCH) => {
      const { auth_token } = data;
      localStorage.setItem("auth-token", auth_token);
      ChangeAuthentication(true);
    },

    onError: (err: POSTFETCH) => {},
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
        const context = {
          Username: login_username,
          Password: login_password,
        };
        SendPOSTRequest("/login", context);
      } else {
        const dummy = {...login_error};
        dummy.password_err = 'Password must contain a number'
        setLoginError(dummy);
      }
    }else {
      if (login_username.length < 5) {
        const dummy = {...login_error};
        dummy.username_err = 'Username length must be atleast 5'
        setLoginError(dummy);
      } 
      if (login_password.length < 8) {
        const dummy = {...login_error};
        dummy.password_err = 'Password length must be atleast 8'
        setLoginError(dummy);
      }
    }
  };

  const SignupFormSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      signup_username.length > 4 &&
      signup_password === signup_confirm &&
      signup_password.length > 7 &&
      signup_phone.length > 10
    ) {
      const number_regex = /[0-9]/;
      if (number_regex.exec(signup_password)) {
        const context = {
          Username: signup_username,
          Password: signup_password,
          Confirm: signup_confirm,
          Phone: signup_phone,
        };
        SendPOSTRequest("/signup", context);
      } else {
        const dummy = {...signup_error};
        dummy.password_err = 'Password must contain a number'
        setSignupError(dummy);
      }
    }else {
      if (signup_username.length < 5) {
        const dummy = {...signup_error};
        dummy.username_err = 'Username length must be atleast 5'
        setSignupError(dummy);
      }

      if (signup_password.length < 8) {
        const dummy = {...signup_error};
        dummy.password_err = 'Password length must be atleast 8'
        setSignupError(dummy);
      } else if (signup_confirm !== signup_password) {
        const dummy = {...signup_error};
        dummy.confirm_err = 'Passwords donot match'
        setSignupError(dummy);
      }

      if (signup_phone.length < 10) {
        const dummy = {...signup_error};
        dummy.phone_err = 'Phone number not found'
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
