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
        <FormHeader/>
        <Form>
          <FormLabel />
          <FormInput />

          <FormLabel />
          <FormInput />

          <FormLabel />
          <FormInput />

          <FormLabel />
          <FormInput />
        </Form>
      </FormContainer>
    </React.Fragment>
  );
};

export default Signup;
