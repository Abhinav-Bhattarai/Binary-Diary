import { FollowingData } from "./interfaces";

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
  
export const FollowingListSerialization = (FollowingList: Array<string>, request_count: number) => {
  return FollowingList.slice(request_count * 6, 6);
}