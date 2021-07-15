import React from "react";
import { useHistory } from "react-router-dom";
import { ScrollToBottom } from "../../../Container/LandingPage/helper";
import { SignupProps } from "../Reusables/interfaces";
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
    UsernameRef,
    PasswordRef,
    ConfirmRef,
    PhoneRef,
    Error,
  } = props;
  const { cred_err } = Error;
  const history = useHistory();

  const ChangeRoute = () => {
    ScrollToBottom();
    history.push("/login");
  };

  return (
    <React.Fragment>
      <PageContainer>
        <FormContainer>
          <FormHeader name="Signup" />
          {cred_err && <CredentialError name={cred_err} />}
          <Form Submit={Submit}>
            <FormLabel html_for="username-signup" name="Username" />
            <FormInput
              value={username}
              change={changeUsername}
              name="username-signup"
              type="text"
              Reference={UsernameRef}
            />

            <FormLabel html_for="password-signup" name="Password" />
            <FormInput
              value={password}
              change={changePassword}
              name="password-signup"
              type="password"
              Reference={PasswordRef}
            />

            <FormLabel html_for="confirm-signup" name="Confirm" />
            <FormInput
              value={confirm}
              change={changeConfirm}
              name="confirm-signup"
              type="password"
              Reference={ConfirmRef}
            />

            <FormLabel html_for="phone-signup" name="Phone" />
            <FormInput
              value={phone}
              change={changePhone}
              name="phone-signup"
              type="text"
              Reference={PhoneRef}
            />
            <FormButton name="Signup" />
          </Form>
          <ChangeRouterButton
            name="Already Have an Account ?"
            Change={ChangeRoute}
          />
        </FormContainer>
      </PageContainer>
    </React.Fragment>
  );
};

export default Signup;