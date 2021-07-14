import React, { useState } from "react";
import { AiOutlineLike, AiOutlinePlusCircle } from "react-icons/ai";
import { MdComment } from "react-icons/md";
import { useLazyQuery, useMutation } from "@apollo/client";

import "./post-card.scss";
import InteractionContainer, {
  Interactants,
} from "../PostContainer/Interaction/interaction";
import { PostLikeMutation } from "../../../GraphQL/mutations";
import { FetchPostComments } from "../../../GraphQL/gql";
import { COMMENTS } from "../CommentCard/inteface";
import DefaultCommentSection, {
  PostCardImageContainer,
  POSTCARDPROPS,
  SerializeComments,
} from "./reusables";
import CommentSection from "../CommentCard/comment-card";

const PostCard: React.FC<POSTCARDPROPS> = (props) => {
  const { children } = props;
  // state
  const [likeStatus, setLikeStatus] = useState<string>(
    props.isPostLiked ? "#00acee" : ""
  );
  const [isCommentVisible, setIsCommentVisible] = useState<boolean | null>(
    null
  );
  const [requestCount, setRequestCount] = useState<number>(0);
  const [isFetchlimitReached, setIsFetchLimitReached] = useState<boolean>(true);
  const [comments, setComments] = useState<Array<COMMENTS> | null>(null);

  // apollo-client
  const [GetComments] = useLazyQuery(FetchPostComments, {
    onCompleted: (data) => {
      const { GetPostComments }: { GetPostComments: Array<COMMENTS> } = data;
      let SerializedComments = [...GetPostComments];
      if (comments && SerializedComments.length > 0) {
        SerializedComments = SerializeComments(comments, SerializedComments);
      }
      setComments(SerializedComments);
      setRequestCount(requestCount + 1);
      setIsCommentVisible(true);
      if (GetPostComments.length >= 8) setIsFetchLimitReached(false);
      if (GetPostComments.length < 8) setIsFetchLimitReached(true);
      else setIsCommentVisible(true);
    },
  });
  const [MutatePostLike] = useMutation(PostLikeMutation);

  // event functions
  const LikeClickHandler = (id: string) => {
    if (props.ChangeLikedPost) {
      if (likeStatus === "") {
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
        props.ChangeLikedPost(false, props.id);
        setLikeStatus("#00acee");
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
        props.ChangeLikedPost(true, props.id);
        setLikeStatus("");
      }
    }
  };

  const CommentClickHandler = () => {
    if (!comments) {
      setIsCommentVisible(false);
      window.scrollTo(0, window.scrollY + 50);
      GetComments({
        variables: {
          id: props.UserInfo?.userID,
          auth_token: props.UserInfo?.auth_token,
          uid: props.UserInfo?.uid,
          PostID: props.id,
          requestCount,
        },
      });
    }
  };

  const FetchMoreComments = () => {
    if (isFetchlimitReached === false) {
      setIsFetchLimitReached(true);
      GetComments({
        variables: {
          id: props.UserInfo?.userID,
          auth_token: props.UserInfo?.auth_token,
          uid: props.UserInfo?.uid,
          PostID: props.id,
          requestCount,
        },
      });
    }
  };
  return (
    <React.Fragment>
      <main
        id="post-card-container"
        onClick={props.Click ? props.Click : undefined}
      >
        {children}
        <PostCardImageContainer
          id={props.id}
          DbClick={LikeClickHandler}
          source={props.Post}
        />
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
        {isCommentVisible && comments && (
          <>
            {props.UserInfo && (
              <>
                <CommentSection
                  PostID={props.id}
                  Comments={comments}
                  userInfo={props.UserInfo}
                  isFetchLimitReached={isFetchlimitReached}
                  FetchMoreComments={FetchMoreComments}
                />
              </>
            )}
          </>
        )}
        {isCommentVisible === false && <DefaultCommentSection />}
      </main>
    </React.Fragment>
  );
};

export default PostCard;