import React from "react";
import { useHistory } from "react-router-dom";
import { ScrollToBottom } from "../../../Container/LandingPage/helper";
import { LoginProps } from "../Reusables/interfaces";
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
        </FormContainer>
      </PageContainer>
    </React.Fragment>
  );
};

export default Login;
