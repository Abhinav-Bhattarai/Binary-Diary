import React, { Suspense, useState } from "react";
import { Route, Switch } from "react-router";
import LoadingPage from "../../Components/UI/LoadingPage/LoadingPage";
import { usePostRequest } from "../../Hooks/LandingPage";

const AsyncSignup = React.lazy(
  () => import("../../Components/LandingPage/SIgnup/signup")
);
const AsyncLogin = React.lazy(
  () => import("../../Components/LandingPage/Login/login")
);

const LandingPage = () => {
  const [login_username, setLoginUsername] = useState<string>("");
  const [login_password, setLoginPassword] = useState<string>("");
  const [signup_username, setSignupUsername] = useState<string>("");
  const [signup_password, setSignupPassword] = useState<string>("");
  const [signup_confirm, setSingupConfirm] = useState<string>("");
  const [signup_phone, setSignupPhone] = useState<string>("");

  const { SendPOSTRequest } = usePostRequest({
    onComplete: (data: object) => {},

    onError: (err: object) => {},
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
