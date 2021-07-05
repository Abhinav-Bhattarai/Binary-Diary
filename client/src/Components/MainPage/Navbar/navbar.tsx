import React from "react";
import AppLogo from "../../../assets/Images/github.svg";
import {
  LogoProps,
  NavbarProps,
  ProfileAreaProps,
  SearchBarProps,
} from "../interfaces";
import { HomeIcon, MessageIcon, RequestIcon } from "./logo";
import "./navbar.scss";

const SubContainer: React.FC<{ id: string }> = (props) => {
  const { children, id } = props;
  return (
    <main className="sub-container" id={id}>
      {children}
    </main>
  );
};

const NavbarContainer: React.FC<{}> = ({ children }) => {
  return <nav id="navbar-container">{children}</nav>;
};

const Logo: React.FC<LogoProps> = (props) => {
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

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { value, change, placeholder, name, type, Blur } = props;
  return (
    <input
      className="search-bar"
      value={value}
      onChange={change}
      placeholder={placeholder}
      name={name}
      type={type}
      autoComplete='off'
      onBlur={Blur}
    />
  );
};

const ProfileArea: React.FC<ProfileAreaProps> = (props) => {
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

const LogoContainer: React.FC<{
  click: (event: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ children, click }) => {
  return (
    <nav id="logo-container" onClick={click}>
      {children}
    </nav>
  );
};

const Navbar: React.FC<NavbarProps> = (props) => {
  const {
    change,
    value,
    HomePressHandler,
    SuggestionPressHandler,
    MessagesPressHandler,
    ProfilePressHandler,
    ProfilePicture,
    Username,
    Blur
  } = props;

  return (
    <React.Fragment>
      <NavbarContainer>
        <SubContainer id="sub-container-1">
          <Logo source={AppLogo} width="40px" height="40px" />
          <SearchBar
            change={change}
            value={value}
            placeholder="Search ...."
            name="search-bar"
            type="text"
            Blur={Blur}
          />
        </SubContainer>
        <SubContainer id="sub-container-2"></SubContainer>
        <SubContainer id="sub-container-3">
          <LogoContainer click={HomePressHandler}>
            <HomeIcon />
          </LogoContainer>

          <LogoContainer click={SuggestionPressHandler}>
            <RequestIcon />
          </LogoContainer>

          <LogoContainer click={MessagesPressHandler}>
            <MessageIcon />
          </LogoContainer>

          <LogoContainer click={ProfilePressHandler}>
            <ProfileArea
              source={ProfilePicture}
              Username={Username}
            />
          </LogoContainer>
        </SubContainer>
      </NavbarContainer>
    </React.Fragment>
  );
};

export default React.memo(Navbar);