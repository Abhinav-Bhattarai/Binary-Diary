import React from "react";
import "./post-card.scss";
import DefaultProfile from "../../../assets/Images/profile-user.svg";
import PostCardSpinner from "../../UI/Spinner/PostCardSpinner/postcard-spinner";
import { GenerateDate } from "./helper";

interface PostCardHeaderProps {
  source: string;
  Username: string;
  PostDate: string;
}

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

export const PostCardHeader: React.FC<PostCardHeaderProps> = (props) => {
  const { source, Username, PostDate } = props;
  const date = GenerateDate(PostDate);
  return (
    <header id="post-card-header">
      <img
        src={source.length > 0 ? source : DefaultProfile}
        width="40px"
        height="40px"
        alt="header-profile"
      />
      <main>
        <div id="post-header-data-username">{Username}</div>
        <div id="post-header-data-date">{date}</div>
      </main>
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
