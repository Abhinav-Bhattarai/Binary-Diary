import React from "react";
import { useHistory } from "react-router-dom";
import { LoginError, ScrollToBottom } from "../../../Container/LandingPage/landingpage";
// import FacebookLogo from '../../../assets/Images/facebook.svg';
// import InstagramLogo from '../../../assets/Images/instagram.svg';
import {
  ChangeRouterButton,
  CredentialError,
  Form,
  FormButton,
  FormContainer,
  FormHeader,
  FormInput,
  FormLabel,
  PageContainer,
} from "../Reusables/reusables";

interface LoginProps {
  username: string;
  password: string;
  Submit: (event: React.FormEvent) => void;
  changeUsername: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  Error: LoginError;
  UsernameRef: React.RefObject<HTMLInputElement>;
  PasswordRef: React.RefObject<HTMLInputElement>;
}

const Login: React.FC<LoginProps> = (props) => {
  const {
    username,
    password,
    Submit,
    changePassword,
    changeUsername,
    UsernameRef,
    PasswordRef,
    Error,
  } = props;
  const { cred_err } = Error;
  const history = useHistory();

  const ChangeRoute = () => {
    ScrollToBottom();
    history.push("/signup");
  };

  return (
    <React.Fragment>
      <PageContainer>
        <FormContainer>
          <FormHeader name="Login" />
          {cred_err && <CredentialError name={cred_err} />}
          <Form Submit={Submit}>
            <FormLabel html_for="username-login" name="Username" />
            <FormInput
              name="username-login"
              value={username}
              change={changeUsername}
              type="text"
              Reference={UsernameRef}
            />

            <FormLabel html_for="password-login" name="Password" />
            <FormInput
              name="password-login"
              value={password}
              change={changePassword}
              type="password"
              Reference={PasswordRef}
            />
            <FormButton name="Login" />
          </Form>
          <ChangeRouterButton name="Create New Account" Change={ChangeRoute} />
          {/* <LogoContainer>
          <LogoAuth url={FacebookLogo}/>
          <LogoAuth url={InstagramLogo}/>
        </LogoContainer> */}
        </FormContainer>
      </PageContainer>
    </React.Fragment>
  );
};

export default Login;
