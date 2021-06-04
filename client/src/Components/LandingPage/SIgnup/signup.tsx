import React from "react";
import { useHistory } from 'react-router-dom';
import { SignupError } from "../../../Container/LandingPage/landingpage";
import {
  ChangeRouterButton,
  Form,
  FormButton,
  FormContainer,
  FormHeader,
  FormInput,
  FormLabel,
} from "../Reusables/reusables";

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
  Error: SignupError;
  UsernameRef: React.RefObject<HTMLInputElement>
  PasswordRef: React.RefObject<HTMLInputElement>
  ConfirmRef: React.RefObject<HTMLInputElement>
  PhoneRef: React.RefObject<HTMLInputElement>
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
  const history = useHistory();

  const ChangeRoute = () => {
    history.push('/login');
  }

  return (
    <React.Fragment>
      <FormContainer>
        <FormHeader name='Signup'/>
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
          <FormButton name='Signup'/>
        </Form>
        <ChangeRouterButton name='Already Have an Account ?' Change={ChangeRoute}/>
      </FormContainer>
    </React.Fragment>
  );
};

export default Signup;