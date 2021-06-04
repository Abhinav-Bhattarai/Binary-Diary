import React from "react";
import { useHistory } from "react-router-dom";
import { LoginError } from '../../../Container/LandingPage/landingpage';
// import FacebookLogo from '../../../assets/Images/facebook.svg';
// import InstagramLogo from '../../../assets/Images/instagram.svg';
import {
  ChangeRouterButton,
  Form,
  FormButton,
  FormContainer,
  FormHeader,
  FormInput,
  FormLabel,
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
};

const Login: React.FC<LoginProps> = (props) => {
  const { username, password, Submit, changePassword, changeUsername, UsernameRef, PasswordRef } = props;
  const history = useHistory();

  const ChangeRoute = () => {
    history.push("/signup");
  };

  return (
    <React.Fragment>
      <FormContainer>
        <FormHeader name="Login" />
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
    </React.Fragment>
  );
};

export default Login;
