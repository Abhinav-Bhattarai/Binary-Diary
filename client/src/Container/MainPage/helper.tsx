import { FollowingData } from "./interfaces";

const Convert2Dto1D = (Posts: Array<FollowingData>) => {
    const dummy = [];
    // O(n^2)
    for (let userInfo of Posts) {
      for (let posts of userInfo.Posts) {
        dummy.push(posts);
      }
    }
    return dummy;
  };
  
export const FollowingListSerialization = (FollowingList: Array<FollowingData>) => {
    let data: string[] = [];
    if (FollowingList.length > 0) {
      data = Convert2Dto1D(FollowingList);
      let posts_sliced = data;
      if (data.length >= 10) {
        posts_sliced = data.slice(0, 9);
      }
      return posts_sliced
    };
    return data;
  }