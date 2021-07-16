import { UserData } from "../../../Container/MainPage/interfaces";

export const GetPostLikeStatus = (ProfileData: UserData | null, post: any) => {
  let isPostLiked = false;
  if (ProfileData) {
    if (ProfileData.LikedPosts.length > 0) {
      for (let id of ProfileData.LikedPosts) {
        if (post._id === id) {
          isPostLiked = true;
          break;
        }
      }
    }
  }
  return isPostLiked;
};
