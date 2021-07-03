import React, { useState } from "react";
import DefaultProfile from "../../../../assets/Images/profile-user.svg";
import InteractionContainer, { Interactants } from "../Interaction/interaction";
import { AiOutlineLike, AiOutlinePlusCircle } from "react-icons/ai";
import { MdComment } from "react-icons/md";
import "./post-card.scss";
import { useMutation } from "@apollo/client";
import { PostLikeMutation } from "../../../../GraphQL/mutations";
import { UserInfo } from "../../../../Container/MainPage/interfaces";

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

interface POSTCARDPROPS {
  isPostLiked: boolean;
  id: string;
  UserInfo: UserInfo | null;
  Click?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const PostCard: React.FC<POSTCARDPROPS> = (props) => {
  const [likeStatus, setLikeStatus] = useState<string>(
    props.isPostLiked ? "#00acee" : ""
  );
  const [MutatePostLike] = useMutation(PostLikeMutation);
  const { children } = props;
  const LikeClickHandler = (id: string) => {
    if (likeStatus === "") {
      setLikeStatus("#00acee");
      MutatePostLike({
        variables: {
          type: "like",
          id: props.UserInfo?.userID,
          Username: props.UserInfo?.username,
          auth_token: props.UserInfo?.auth_token,
          uid: props.UserInfo?.uid,
          PostID: id,
        },
      });
    } else {
      MutatePostLike({
        variables: {
          type: "unlike",
          id: props.UserInfo?.userID,
          Username: props.UserInfo?.username,
          auth_token: props.UserInfo?.auth_token,
          uid: props.UserInfo?.uid,
          PostID: id,
        },
      });
      setLikeStatus("");
    }
  };

  const CommentClickHandler = () => {};
  return (
    <React.Fragment>
      <main id="post-card-container" onClick={props.Click ? props.Click : undefined}>
        {children}
        <InteractionContainer>
          <Interactants
            id={props.id}
            hoverColor={likeStatus}
            Click={LikeClickHandler}
          >
            <AiOutlineLike />
          </Interactants>

          <Interactants id={props.id} hoverColor="#333" Click={() => {}}>
            <AiOutlinePlusCircle />
          </Interactants>

          <Interactants
            id={props.id}
            hoverColor="#333"
            Click={CommentClickHandler}
          >
            <MdComment />
          </Interactants>
        </InteractionContainer>
      </main>
    </React.Fragment>
  );
};

export default PostCard;
