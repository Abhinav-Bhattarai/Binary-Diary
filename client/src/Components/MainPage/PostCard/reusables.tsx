import React from "react";
import "./post-card.scss";
import DefaultProfile from "../../../assets/Images/profile-user.svg";
import PostCardSpinner from "../../UI/Spinner/PostCardSpinner/postcard-spinner";

export const PostCardImageContainer: React.FC<{
  source: string;
  id: string;
  DbClick: (id: string) => void;
}> = (props) => {
  return (
    <header
      id="post-card-img-container"
      onDoubleClick={props.DbClick.bind(this, props.id)}
    >
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

const DefaultCommentSection = () => {
  return (
    <main id="default-comment-section">
      <PostCardSpinner />
    </main>
  );
};

export default DefaultCommentSection;
