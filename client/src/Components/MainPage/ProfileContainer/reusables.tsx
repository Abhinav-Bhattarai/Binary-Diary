import React from "react";
import "./profile-container.scss";

export const ProfileHeaderImageContainer: React.FC<{ source: string }> = ({
  source,
}) => {
  return (
    <div id="profile-img-container">
      <img src={source} width="200px" height="200px" alt="profile-pic" />
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
  Click: (id: string) => void;
  id: string;
}

export const ProfilePostOverview: React.FC<ProfilePostOverviewProps> = (props) => {
  const { source, Click, id } = props;
  return (
    <React.Fragment>
      <div id="profile-post-overview" onClick={Click.bind(this, id)}>
        <img src={source} alt='profile-overview'/>
      </div>
    </React.Fragment>
  );
};

export const ProfileConfigurationContainer: React.FC<{}> = ({ children }) => {
  return <React.Fragment></React.Fragment>
};
