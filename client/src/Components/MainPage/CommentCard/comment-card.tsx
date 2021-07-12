import React, { useRef } from "react";
import { COMMENTS } from "./inteface";
import DefaultProfile from "../../../assets/Images/profile-user.svg";

import {
  CommentArea,
  CommentCardContainer,
  CommentDataContainer,
  CommenterNameArea,
  CommenterProfile,
  CommentInput,
} from "./reusables";
import "./style.scss";
import { UserInfo } from "../../../Container/MainPage/interfaces";
import { useMutation } from "@apollo/client";
import { MutatePostComments } from "../../../GraphQL/mutations";

interface PROPS {
  Comments: Array<COMMENTS>;
  userInfo: UserInfo;
  PostID: string
}

const CommentSection: React.FC<PROPS> = (props) => {
  const { Comments, userInfo, PostID } = props;
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [MutateComments] = useMutation(MutatePostComments);

  const ChangeComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (commentInputRef.current) {
      commentInputRef.current.value = value;
    }
  };

  const AddCommentHandler = (): void => {
    const config = {
      auth_token: userInfo.auth_token,
      uid: userInfo.uid,
      id: userInfo.userID,
      username: userInfo.username,
      PostID,
      Comment: commentInputRef.current?.value,
    };
    MutateComments({
      variables: config,
    });
    if (commentInputRef.current) commentInputRef.current.value = "";
  };

  const GetKeyboardEvent = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === "Enter" && commentInputRef.current) {
      if (commentInputRef.current.value.length > 0) {
        AddCommentHandler();
      }
    }
  };
  let comments_list: any = <h3> no comments found </h3>
  if (Comments.length > 0) {
    comments_list = (
      Comments.map((comment) => {
        return (
          <CommentCardContainer key={comment._id}>
            <CommenterProfile
              soruce={
                comment.ProfilePicture.length > 0
                  ? comment.ProfilePicture
                  : DefaultProfile
              }
            />
            <CommentDataContainer>
              <CommenterNameArea username={comment.CommenterUsername} />
              <CommentArea comment={comment.Comment} />
            </CommentDataContainer>
          </CommentCardContainer>
        );
      })
    )
  }

  return (
    <React.Fragment>
      <main id="comment-section">
        { comments_list }
      </main>
      <CommentInput
        reference={commentInputRef}
        GetKeyboardEvent={GetKeyboardEvent}
        Change={ChangeComment}
      />
    </React.Fragment>
  );
};

export default React.memo(CommentSection);