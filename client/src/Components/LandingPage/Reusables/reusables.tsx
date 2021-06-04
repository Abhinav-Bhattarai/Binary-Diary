import React from "react";
import Logo from "../../../assets/Images/github.svg";
import { BUTTON, FORM, FORMINPUT, FORMLABEL, HEADER, LOGO, ROUTERBUTTON } from "./interfaces";
import "./reusables.scss";

export const FormContainer: React.FC<{}> = (props) => {
  return <main id="form-container">{props.children}</main>;
};

export const Form: React.FC<FORM> = (props) => {
  const { Submit, children } = props;
  return (
    <React.Fragment>
      <form id="form" onSubmit={Submit}>
        {children}
      </form>
    </React.Fragment>
  );
};

export const FormHeader: React.FC<HEADER> = (props) => {
  return (
    <nav id="form-header">
      <img width="60px" height="60px" src={Logo} alt="logo" />
      <h3 contentEditable={true} style={{ marginTop: "20px", marginBottom: 0 }}>{props.name}</h3>
    </nav>
  );
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

export const FormButton: React.FC<BUTTON> = (props) => {
  const { name } = props;
  return (
    <React.Fragment>
      <button type="button" className="submit-btn">
        {name}
      </button>
    </React.Fragment>
  );
};

export const ChangeRouterButton: React.FC<ROUTERBUTTON> = (props) => {
  const { name, Change } = props;
  return (
    <React.Fragment>
      <button type="button" onClick={Change} className="router-btn">
        {name}
      </button>
    </React.Fragment>
  );
};

export const LogoContainer: React.FC<{}> = (props) => {
  const { children }  = props;
  return (
    <React.Fragment>
      <main id='logo-container'>
        { children }
      </main>
    </React.Fragment>
  )
};

export const LogoAuth: React.FC<LOGO> = (props) => {
  const { url } = props;
  return (
    <React.Fragment>
      <div>
        <img width='60px' height='60px' src={url} alt='logo'/>
      </div>
    </React.Fragment>
  )
} 
