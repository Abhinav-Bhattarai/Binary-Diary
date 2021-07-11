import React from "react";
import { UserInfo } from "../../../Container/MainPage/interfaces";
import DefaultProfile from "../../../assets/Images/profile-user.svg";
import { COMMENTS } from "../CommentCard/inteface";
import PostCardSpinner from "../../UI/Spinner/PostCardSpinner/postcard-spinner";

export const PostCardImageContainer: React.FC<{ source: string }> = (props) => {
  return (
    <header id="post-card-img-container">
      <img draggable={false} src={props.source} alt="post" />
    </header>
  );
};
export const AsyncCommentSection = React.lazy(
  () => import("../CommentCard/comment-card")
);

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

export interface POSTCARDPROPS {
  isPostLiked: boolean;
  id: string;
  UserInfo: UserInfo | null;
  Click?: (event: React.MouseEvent<HTMLDivElement>) => void;
  ChangeLikedPost: ((type: boolean, id: string) => void) | undefined;
}

export const SerializeComments = (
  oldComments: Array<COMMENTS>,
  newComments: Array<COMMENTS>
): Array<COMMENTS> => {
  for (let comment of newComments) {
    oldComments.push(comment);
  }
  return oldComments;
};

const DefaultCommentSection = () => {
  return <main id='default-comment-section'><PostCardSpinner/></main>
};

export default DefaultCommentSection;