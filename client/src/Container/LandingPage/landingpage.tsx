import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import LoadingPage from "../../Components/UI/LoadingPage/LoadingPage";
import { usePostRequest } from "../../Hooks/LandingPage";
import {
  AsyncLogin,
  AsyncSignup,
  Encrypt,
  ScrollToBottom,
  DecryptandAddInLocalStorage,
  validateLoginForm,
  ValidateRegex,
  validateSignupForm,
  UsernameErrorCheck,
  PasswordErrorCheck,
} from "./helper";
import {
  initial_login_error,
  initial_signup_error,
  LoginError,
  POSTFETCH,
  SignupError,
} from "./interface";
interface PROPS {
  ChangeAuthentication: (type: boolean) => void;
}

const LandingPage: React.FC<PROPS> = ({ ChangeAuthentication }) => {
  // states
  const [login_username, setLoginUsername] = useState<string>("");
  const [login_password, setLoginPassword] = useState<string>("");
  const [login_error, setLoginError] = useState<LoginError>(initial_login_error);
  const [signup_error, setSignupError] = useState<SignupError>(initial_signup_error);
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
      DecryptandAddInLocalStorage(EncryptedData);
      history.replace("/post");
      ChangeAuthentication(true);
    },

    onError: (err: POSTFETCH) => {
      if (err.type === "login") {
        LoginUsernameRef.current && (LoginUsernameRef.current.style.border = "2px solid #ff385c");
        LoginPasswordRef.current && (LoginPasswordRef.current.style.border = "2px solid #ff385c");
        const dummy = { ...login_error };
        dummy.cred_err = "Invalid Credentials !!";
        setLoginError(dummy);
      } else {
        SignupUsernameRef.current && (SignupUsernameRef.current.style.border = "2px solid #ff385c");
        SignupPasswordRef.current && (SignupPasswordRef.current.style.border = "2px solid #ff385c");
        const dummy = { ...signup_error };
        dummy.cred_err = "Username already taken !!";
        setSignupError(dummy);
      }
    },
  });

  // form input change
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
    const ValidationStatus = validateLoginForm(login_username, login_password);
    if (ValidationStatus) {
      const RegexCheck = ValidateRegex(login_password);
      if (RegexCheck) {
        let context: any = {
          Username: login_username,
          Password: login_password,
        };
        context = Encrypt(context);
        SendPOSTRequest("https://localhost:8000/login", { ContextData: context });
      } else {
        const dummy = { ...login_error };
        dummy.password_err = "Password must contain a number";
        LoginUsernameRef.current && (LoginUsernameRef.current.style.border = "2px solid #ff385c");
        setLoginError(dummy);
      }
    } else {
      const UserNameError = UsernameErrorCheck(login_username, LoginUsernameRef, login_error);
      const PasswordError = PasswordErrorCheck(login_password, login_password, LoginPasswordRef, login_error)
      if (UserNameError) setLoginError(UserNameError);
      if (PasswordError) setLoginError(PasswordError);
    }
  };

  const SignupFormSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const ValidationStatus = validateSignupForm(signup_username, signup_password, signup_confirm, signup_phone);

    if (ValidationStatus) {
      const RegexCheck = ValidateRegex(login_password);
      if (RegexCheck) {
        let context: any = {
          Username: signup_username,
          Password: signup_password,
          Confirm: signup_confirm,
          Phone: signup_phone,
        };
        context = Encrypt(context);
        SendPOSTRequest("https://localhost:8000/signup", { ContextData: context });
      } else {
        const dummy = { ...signup_error };
        dummy.password_err = "Password must contain a number";
        SignupUsernameRef.current && (SignupUsernameRef.current.style.border = "2px solid #ff385c");
        setSignupError(dummy);
      }
    } else {
      const UserNameError = UsernameErrorCheck(signup_username, SignupUsernameRef, signup_error);
      const PasswordError = PasswordErrorCheck(signup_password, signup_confirm, SignupPasswordRef, signup_error);
      if (UserNameError) {
        // @ts-ignore
        setSignupError(UserNameError);
      }
      if (PasswordError) {
        // @ts-ignore
        setSignupError(PasswordError);
      }
      if (signup_phone.length < 10) {
        const dummy = { ...signup_error };
        dummy.phone_err = "Phone number not found";
        SignupPhoneRef.current && (SignupPhoneRef.current.style.border = "2px solid #ff385c");
        setSignupError(dummy);
      }
    }
  };
  
  useEffect(() => {
    ScrollToBottom();
  }, []);

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