import React, { useState } from "react";
import DefaultProfile from "../../../../assets/Images/profile-user.svg";
import InteractionContainer, { Interactants } from "../Interaction/interaction";
import { AiOutlineLike, AiOutlinePlusCircle } from "react-icons/ai";
import { MdComment } from "react-icons/md";
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

const PostCard: React.FC<{isPostLiked: boolean}> = (props) => {
  const [likeStatus, setLikeStatus] = useState<string>(props.isPostLiked ? '#00acee' : '');
  const { children } = props;
  const LikeClickHandler = () => {
    if (likeStatus === '') setLikeStatus('#00acee');
    else setLikeStatus('');
  };
  const CommentClickHandler = () => {};
  console.log('post-card-rendered')
  return (
    <React.Fragment>
      <main id="post-card-container">
        {children}
        <InteractionContainer>
          <Interactants hoverColor={likeStatus} Click={LikeClickHandler}>
            <AiOutlineLike />
          </Interactants>

          <Interactants hoverColor="#333" Click={() => {}}>
            <AiOutlinePlusCircle />
          </Interactants>

          <Interactants hoverColor="#333" Click={CommentClickHandler}>
            <MdComment />
          </Interactants>
        </InteractionContainer>
      </main>
    </React.Fragment>
  );
};

export default PostCard;
