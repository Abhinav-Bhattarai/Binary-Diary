import React from "react";
import DefaultProfile from "../../../../assets/Images/profile-user.svg";
import "./post-card.scss";

export const PostCardImageContainer: React.FC<{ source: string }> = (props) => {
  return (
    <header id="post-card-img-container">
      <img draggable={false} src={props.source} alt="post" />
    </header>
  );
};

export const PostCardHeader: React.FC<{ source: string; Username: string }> = (
  props
) => {
  const { source, Username } = props;
  return (
    <header id="post-card-header">
      <img
        src={source.length > 0 ? source : DefaultProfile}
        width="40px"
        height="40px"
        alt="header-profile"
      />
      <div>{Username}</div>
    </header>
  );
};

const PostCard: React.FC<{}> = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      <main id="post-card-container">{children}</main>
    </React.Fragment>
  );
};

export default PostCard;
