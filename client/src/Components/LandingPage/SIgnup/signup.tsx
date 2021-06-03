import React from "react";
import {
  Form,
  FormContainer,
  FormHeader,
  FormInput,
  FormLabel,
} from "../Reusables/reusables";
import "./signup.scss";

interface SignupProps {
  username: string;
  password: string;
  confirm: string;
  phone: string;
  Submit: (event: React.FormEvent) => void;
  changeUsername: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeConfirm: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changePhone: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Signup: React.FC<SignupProps> = (props) => {
  const {
    username,
    password,
    confirm,
    phone,
    Submit,
    changeUsername,
    changePassword,
    changeConfirm,
    changePhone,
  } = props;

  return (
    <React.Fragment>
      <FormContainer>
        <FormHeader />
        <Form Submit={Submit}>
          <FormLabel html_for="username-signup" name="Username" />
          <FormInput
            value={username}
            change={changeUsername}
            name="username-signup"
            type="text"
          />

          <FormLabel html_for="password-signup" name="Password" />
          <FormInput
            value={password}
            change={changePassword}
            name="password-signup"
            type="password"
          />

          <FormLabel html_for="confirm-signup" name="Confirm" />
          <FormInput
            value={confirm}
            change={changeConfirm}
            name="confirm-signup"
            type="password"
          />

          <FormLabel html_for="phone-signup" name="Phone" />
          <FormInput
            value={phone}
            change={changePhone}
            name="phone-signup"
            type="text"
          />
        </Form>
      </FormContainer>
    </React.Fragment>
  );
};

export default Signup;
