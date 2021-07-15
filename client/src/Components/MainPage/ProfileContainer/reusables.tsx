import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { IconContext } from "react-icons";
import { AiOutlinePlus } from "react-icons/ai";
import { UserInfo } from "../../../Container/MainPage/interfaces";
import { FollowRequestMutations } from "../../../GraphQL/mutations";
import { ProfilePostDetailsType, PROFILESTATEBTN } from "../interfaces";
import PostCard from "../PostCard/post-card";
import { PostCardHeader } from "../PostCard/reusables";
import "./profile-container.scss";

export const Logo: React.FC<{ fontSize?: string }> = ({
  children,
  fontSize,
}) => {
  return (
    <IconContext.Provider
      value={{
        style: { color: "#333", fontSize: fontSize ? fontSize : "25px" },
      }}
    >
      {children}
    </IconContext.Provider>
  );
};

export const ProfileHeaderImageContainer: React.FC<{
  source: string;
  Click: ((type: string) => void) | undefined;
  ownerStatus: boolean;
}> = ({ source, Click, ownerStatus }) => {
  return (
    <div id="profile-img-container">
      <img
        draggable={false}
        src={source}
        width="200px"
        height="200px"
        alt="profile-pic"
      />
      {ownerStatus && (
        <div
          id="abs-img-el"
          onClick={Click ? Click.bind(this, "profile") : undefined}
        >
          <Logo>
            <AiOutlinePlus />
          </Logo>
        </div>
      )}
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

export const ConfigLogoContainer: React.FC<{ click: (type: string) => void }> =
  ({ children, click }) => {
    return (
      <nav id="config-logo-container" onClick={click.bind(this, "photo")}>
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

export const Paginate: React.FC<{ Click: () => void; color: string }> = ({
  Click,
  color,
}) => {
  return (
    <div
      id="add-logo-container"
      style={{ backgroundColor: color }}
      onClick={Click}
    >
      <Logo>
        <AiOutlinePlus />
      </Logo>
    </div>
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
  Click: (config: ProfilePostDetailsType) => void;
  ProfilePicture: string;
  UserInfo: UserInfo | null;
}

export const ProfilePostOverview: React.FC<ProfilePostOverviewProps> = (
  props
) => {
  const {
    source,
    Click,
    Likes,
    CreatorID,
    CreatorUsername,
    Caption,
    LikeStatus,
    id,
    ProfilePicture,
    UserInfo,
  } = props;
  const config = {
    Likes,
    CreatorID,
    CreatorUsername,
    Caption,
    LikeStatus,
    id,
    Post: source,
    UserInfo,
    ProfilePicture,
  };
  return (
    <React.Fragment>
      <div id="profile-post-overview" onClick={Click.bind(this, config)}>
        <img draggable={false} src={source} alt="profile-overview" />
        <div id="profile-hover"></div>
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

export const ProfileStateButton: React.FC<PROFILESTATEBTN> = (props) => {
  const { name, userInfo, RequesterID, SendSocketRequest } = props;
  const [type, setType] = useState<
    "Follow" | "Following" | "Requested" | "Loading"
  >(name);
  const [MutateFollowRequests] = useMutation(FollowRequestMutations);

  const ClickHandler = () => {
    MutateFollowRequests({
      variables: {
        type: name,
        id: userInfo?.userID,
        uid: userInfo?.uid,
        auth_token: userInfo?.auth_token,
        RequesterID,
        username: userInfo?.username,
      },
    });
    if (type === "Follow") {
      setType("Requested");
      SendSocketRequest(RequesterID);
    } else if (type === "Following") setType("Follow");
  };

  return (
    <button type="button" id="profile-state-btn" onClick={ClickHandler}>
      {type}
    </button>
  );
};

const DetailedPostContainer: React.FC<ProfilePostDetailsType> = (props) => {
  const {
    LikeStatus,
    id,
    CreatorUsername,
    Post,
    UserInfo,
    ProfilePicture,
    RevertPopup,
    ChangeLikedPosts,
  } = props;
  const PostCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };
  return (
    <main id="detailed-post-container" onClick={RevertPopup}>
      <PostCard
        id={id}
        UserInfo={UserInfo}
        isPostLiked={LikeStatus}
        Click={PostCardClick}
        ChangeLikedPost={ChangeLikedPosts}
        Post={Post}
      >
        <PostCardHeader Username={CreatorUsername} source={ProfilePicture} />
      </PostCard>
    </main>
  );
};

export default DetailedPostContainer;
