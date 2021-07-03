import React from "react";
import { IconContext } from "react-icons";
import "./profile-container.scss";

export const ProfileHeaderImageContainer: React.FC<{ source: string }> = ({
  source,
}) => {
  return (
    <div id="profile-img-container">
      <img
        draggable={false}
        src={source}
        width="200px"
        height="200px"
        alt="profile-pic"
      />
    </div>
  );
};

export const ProfileHeaderContainer: React.FC<{}> = ({ children }) => {
  return <header id="profile-header-container">{children}</header>;
};

export const ProfileHeaderInfo: React.FC<{
  name: string;
  value: string | number | undefined;
}> = (props) => {
  const { name, value } = props;
  return (
    <main id="profile-overview-container">
      <div className="overview">{name}</div>
      <div className="overview">{value}</div>
    </main>
  );
};

export const Logo: React.FC<{}> = ({ children }) => {
  return (
    <IconContext.Provider
      value={{ style: { color: "#333", fontSize: "25px" } }}
    >
      {children}
    </IconContext.Provider>
  );
};

export const ConfigLogoContainer: React.FC<{ click: () => void }> = ({
  children,
  click,
}) => {
  return (
    <nav id="config-logo-container" onClick={click}>
      {children}
    </nav>
  );
};

export const ProfileInformationOverView: React.FC<{}> = ({ children }) => {
  return <main id="profile-information-overview">{children}</main>;
};

export const ProfilePostAreaContainer: React.FC<{}> = ({ children }) => {
  return <article id="profile-post-area-container">{children}</article>;
};

export const ProfilePostArea: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="profile-post-area">{children}</main>
    </React.Fragment>
  );
};

interface ProfilePostOverviewProps {
  source: string;
  id: string;
  LikeStatus: boolean;
  Likes: Array<string>;
  Caption: string;
  CreatorID: string;
  CreatorUsername: string;
}

export const ProfilePostOverview: React.FC<ProfilePostOverviewProps> = (
  props
) => {
  const { source } = props;
  return (
    <React.Fragment>
      <div id="profile-post-overview">
        <img draggable={false} src={source} alt="profile-overview" />
      </div>
    </React.Fragment>
  );
};

export const ProfileConfigurationContainer: React.FC<{}> = React.memo(
  ({ children }) => {
    return (
      <React.Fragment>
        <main id="profile-config-container">{children}</main>
      </React.Fragment>
    );
  }
);

export const SettingsOverViewPopup: React.FC<{ hoverOut: () => void }> = (
  props
) => {
  const { children, hoverOut } = props;
  return (
    <React.Fragment>
      <main id="settings-overview-container" onMouseLeave={hoverOut}>
        {children}
      </main>
    </React.Fragment>
  );
};

export const SettingsOverViewElement: React.FC<{
  name: string;
  press: () => void;
}> = (props) => {
  const { name, press } = props;
  return (
    <nav id="setting-overview-element" onClick={press}>
      {name}
    </nav>
  );
};

export const ProfileStateButton: React.FC<{ name: string }> = (props) => {
  const { name } = props;
  return (
    <button type="button" id="profile-state-btn">
      {name}
    </button>
  );
};
