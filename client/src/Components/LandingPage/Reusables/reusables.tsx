import React from "react";
import { FORM, FORMINPUT, FORMLABEL } from "./interfaces";

export const FormContainer: React.FC<{}> = () => {
  return <React.Fragment></React.Fragment>;
};

export const Form: React.FC<FORM> = (props) => {
  const { Submit, children } = props;
  return (
    <React.Fragment>
      <form onSubmit={Submit}>{children}</form>
    </React.Fragment>
  );
};

export const FormHeader: React.FC<{}> = () => {
  return <React.Fragment></React.Fragment>;
};

export const FormInput: React.FC<FORMINPUT> = (props) => {
  const { type, value, change, name } = props;
  return (
    <React.Fragment>
      <input
        value={value}
        type={type}
        onChange={change}
        className="form-input"
        name={name}
      />
    </React.Fragment>
  );
};

export const FormLabel: React.FC<FORMLABEL> = (props) => {
  const { html_for, name } = props;
  return (
    <React.Fragment>
      <label htmlFor={html_for} className="form-label">
        {name}
      </label>
    </React.Fragment>
  );
};

export const FormButton: React.FC<{}> = () => {
  return (
    <React.Fragment>
      <button></button>
    </React.Fragment>
  );
};
