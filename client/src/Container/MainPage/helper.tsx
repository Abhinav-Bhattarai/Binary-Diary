import React from "react";
import { FollowingData } from "./interfaces";

export const AsyncPostContainer = React.lazy(
  () => import("../../Components/MainPage/PostContainer/post-container")
);
export const AsyncMessageContainer = React.lazy(
  () => import("../../Components/MainPage/MessageContainer/message-container")
);
export const AsyncProfileContainer = React.lazy(
  () => import("../../Components/MainPage/ProfileContainer/profile-container")
);
export const AsyncRequestContainer = React.lazy(
  () => import("../../Components/MainPage/RequestContainer/requests-container")
);

export const FooterRef: React.FC<{
  Reference: React.RefObject<HTMLDivElement>;
}> = ({ Reference }) => {
  return (
    <footer ref={Reference} style={{ width: "100%", height: "2px" }}></footer>
  );
};

export const Convert2Dto1D = (Posts: Array<FollowingData>) => {
  const dummy = [];
  // O(n^2)
  for (let userInfo of Posts) {
    for (let posts of userInfo.Posts) {
      dummy.push(posts);
    }
  }
  return dummy;
};

export const PostListSerialization = (
  FollowingList: Array<string>,
  request_count: number
) => {
  return FollowingList.slice(request_count * 6, (request_count + 1) * 6);
};

export const RemoveAcceptedRequestFromList = (
  arr: Array<any>,
  index: number
) => {
  arr.splice(index, 1);
  return arr;
};

export const LocalStorageDataValidity = () => {
  const auth_token = localStorage.getItem("auth-token");
  const username = localStorage.getItem("username");
  const userID = localStorage.getItem("userID");
  const uid = localStorage.getItem("uid");
  if (auth_token && username && userID && uid) {
    return { auth_token, username, userID, uid };
  }
  return null;
};
