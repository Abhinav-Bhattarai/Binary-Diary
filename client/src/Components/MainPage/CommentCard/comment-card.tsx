import React, { useEffect, useRef } from "react";
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
import { Paginate } from "../ProfileContainer/reusables";

interface PROPS {
  Comments: Array<COMMENTS>;
  userInfo: UserInfo;
  PostID: string;
  isFetchLimitReached: boolean | null;
  FetchMoreComments: () => void;
};

const CommentSection: React.FC<PROPS> = (props) => {
  const { Comments, userInfo, PostID, isFetchLimitReached, FetchMoreComments } = props;
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const [MutateComments] = useMutation(MutatePostComments);

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

  let comments_list: any = <h4> no comments </h4>;
  if (Comments.length > 0) {
    comments_list = Comments.map((comment) => {
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
    });
  };

  const ChangeReferenceValue = (event: any) => {
    event.stopPropagation();
    if (event.inputType === 'insertParagraph' && event.data === null && commentInputRef.current) {
      if (commentInputRef.current.value.length > 0) AddCommentHandler();
    } else {
      if (commentInputRef.current) {
        commentInputRef.current.value += event.data; 
      }
    }
  }

  useEffect(() => {
    if (editableRef.current) {
      const PersistantRef = editableRef.current
      PersistantRef.addEventListener('input', ChangeReferenceValue);
      return () => {
        PersistantRef.removeEventListener('input', ChangeReferenceValue!);
      }
    }
  })

  return (
    <React.Fragment>
      <main id="comment-section">
        {comments_list}
        {isFetchLimitReached === false && (
          <Paginate color='rgb(232, 232, 232)' Click={FetchMoreComments} />
        )}
      </main>
      <CommentInput
        reference={commentInputRef}
        EditableRef={editableRef}
      />
    </React.Fragment>
  );
};

export default React.memo(CommentSection);
