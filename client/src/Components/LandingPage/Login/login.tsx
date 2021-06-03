import React from "react";
import {
  Form,
  FormContainer,
  FormHeader,
  FormInput,
  FormLabel,
} from "../Reusables/reusables";
import "./login.scss";

interface LoginProps {
  username: string;
  password: string;
  Submit: (event: React.FormEvent) => void;
  changeUsername: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const { username, password, Submit, changePassword, changeUsername } = props;

  return (
    <React.Fragment>
      <FormContainer>
        <FormHeader />
        <Form>
          <FormLabel />
          <FormInput />

          <FormLabel />
          <FormInput />
        </Form>
      </FormContainer>
    </React.Fragment>
  );
};

export default Login;
