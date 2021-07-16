import React from 'react';
import { COMMENTS } from "../CommentCard/inteface";
import { UserInfo } from "../../../Container/MainPage/interfaces";

export interface POSTCARDPROPS {
  isPostLiked: boolean;
  id: string;
  UserInfo: UserInfo | null;
  Click?: (event: React.MouseEvent<HTMLDivElement>) => void;
  ChangeLikedPost: ((type: boolean, id: string) => void) | undefined;
  Post: string;
}

export const AsyncCommentSection = React.lazy(
  () => import("../CommentCard/comment-card")
);
// helper
export const SerializeComments = (
  oldComments: Array<COMMENTS>,
  newComments: Array<COMMENTS>
): Array<COMMENTS> => {
  for (let comment of newComments) {
    oldComments.push(comment);
  }
  return oldComments;
};
