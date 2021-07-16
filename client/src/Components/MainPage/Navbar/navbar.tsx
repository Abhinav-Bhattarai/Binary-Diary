import React from "react";
import AppLogo from "../../../assets/Images/github.svg";
import { NavbarProps } from "../interfaces";
import { HomeIcon, MessageIcon, RequestIcon } from "./logo";
import { Logo, LogoContainer, NavbarContainer, ProfileArea, SearchBar, SubContainer } from "./reusable";

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
    Blur,
    reference
  } = props;

  return (
    <React.Fragment>
      <NavbarContainer reference={reference}>
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