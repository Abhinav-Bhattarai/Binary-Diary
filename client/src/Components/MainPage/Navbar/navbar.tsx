import React from "react";
import AppLogo from "../../../assets/Images/github.svg";
import { LogoProps, NavbarProps, SearchBarProps } from "../interfaces";
import "./navbar.scss";

const SubContainer: React.FC<{ flex: number }> = (props) => {
  const { flex, children } = props;
  return (
    <main id="sub-container" style={{ flex }}>
      {children}
    </main>
  );
};

const NavbarContainer: React.FC<{}> = ({ children }) => {
  return <nav id="navbar-container">{children}</nav>;
};

const Logo: React.FC<LogoProps> = (props) => {
  const { source, width, height } = props;
  return <img src={source} alt="Logo" width={width} height={height} />;
};

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { value, change, placeholder, name, type } = props;
  return (
    <input
      className="search-bar"
      value={value}
      onChange={change}
      placeholder={placeholder}
      name={name}
      type={type}
    />
  );
};

const Navbar: React.FC<NavbarProps> = (props) => {
  const { change, value } = props;
  return (
    <React.Fragment>
      <NavbarContainer>
        <SubContainer flex={1}>
          <Logo source={AppLogo} width="40px" height="40px" />
          <SearchBar
            change={change}
            value={value}
            placeholder="Search ...."
            name="search-bar"
            type="text"
          />
        </SubContainer>
        <SubContainer flex={1}></SubContainer>
        <SubContainer flex={2}></SubContainer>
      </NavbarContainer>
    </React.Fragment>
  );
};

export default Navbar;
