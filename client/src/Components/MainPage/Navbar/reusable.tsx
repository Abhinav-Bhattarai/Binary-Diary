import React from 'react';
import {
  LogoProps,
  ProfileAreaProps,
  SearchBarProps,
} from "../interfaces";
import "./navbar.scss";

export const SubContainer: React.FC<{ id: string }> = (props) => {
  const { children, id } = props;
  return (
    <main className="sub-container" id={id}>
      {children}
    </main>
  );
};

export const NavbarContainer: React.FC<{
  reference: React.RefObject<HTMLDivElement>;
}> = ({ children, reference }) => {
  return (
    <nav id="navbar-container" ref={reference}>
      {children}
    </nav>
  );
};

export const Logo: React.FC<LogoProps> = (props) => {
  const { source, width, height } = props;
  return (
    <img
      src={source}
      alt="Logo"
      id="logo-github"
      width={width}
      height={height}
    />
  );
};

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { value, change, placeholder, name, type, Blur } = props;
  return (
    <input
      className="search-bar"
      value={value}
      onChange={change}
      placeholder={placeholder}
      name={name}
      type={type}
      autoComplete="off"
      onBlur={Blur}
    />
  );
};

export const ProfileArea: React.FC<ProfileAreaProps> = (props) => {
  const { source, Username } = props;
  return (
    <React.Fragment>
      <img
        width="34px"
        height="34px"
        src={source}
        id="profile-area-img"
        alt="profile-img"
      />
      <article id="profile-area-username">{Username}</article>
    </React.Fragment>
  );
};

export const LogoContainer: React.FC<{
  click: (event: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ children, click }) => {
  return (
    <nav id="logo-container" onClick={click}>
      {children}
    </nav>
  );
};
