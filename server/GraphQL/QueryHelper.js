import { CommentModel } from "../Models/comment-model.js";
import PostModel from "../Models/post-model.js";
import RegisterModel from "../Models/register-model.js";
import { FlattenPost, SerializeComments } from "./helper.js";

export const GetUserDataCacheCheck = async (cache, id, uid) => {
  const UserData = await cache.get(`UserInfo/${id}/${uid}`);
  if (UserData) {
    return JSON.parse(UserData);
  }
  const response = await RegisterModel.findById(id, {
    Username: 1,
    Followers: 1,
    Following: 1,
    Bio: 1,
    Posts: 1,
    ProfilePicture: 1,
    UniqueID: 1,
    LikedPosts: 1,
    Requested: 1,
    _id: 0,
  });
  if (response !== null) {
    if (response.UniqueID === uid) {
      const FlattendPost = FlattenPost(response.Posts);
      let SerializedData = {
        Username: response.Username,
        Followers: response.Followers,
        Following: response.Following,
        Bio: response.Bio,
        Posts: FlattendPost,
        ProfilePicture: response.ProfilePicture,
        LikedPosts: response.LikedPosts,
        Requested: response.Requested,
      };
      await cache.set(`UserInfo/${id}/${uid}`, JSON.stringify(SerializedData));
      return SerializedData;
    }
    return null;
  }
  return null;
};

export const GetPostDataHandler = async (cache, posts) => {
  const response = await PostModel.find({ _id: { $in: posts } });
  if (response.length > 0) {
    const SortedSerializedDataContainer = [];
    const UnSortedSerializedDataContainer = [];
    for (let data of response) {
      const ProfilePicture = await cache.get(
        `ProfilePicture/${data.CreatorID}`
      );
      const SerializedData = {
        _id: data._id,
        Post: data.Post,
        Caption: data.Caption,
        PostDate: data.PostDate,
        CreatorID: data.CreatorID,
        CreatorUsername: data.CreatorUsername,
        Likes: data.Likes,
        ProfilePicture: ProfilePicture ? ProfilePicture : "",
      };
      UnSortedSerializedDataContainer.push(SerializedData);
    }
    for (let i = UnSortedSerializedDataContainer.length - 1; i >= 0; i--) {
      SortedSerializedDataContainer.push(UnSortedSerializedDataContainer[i]);
    }
    return SortedSerializedDataContainer;
  }
  return [];
};

export const GetPostComments = async (PostID, requestCount, cache) => {
  const response = await CommentModel.find({ PostID }).skip(requestCount * 8).limit(8);
  if (response.length > 0) {
    const SerializedResponse = await SerializeComments(cache, response);
    return SerializedResponse.reverse();
  }
  return response;
};

export const FetchUserData = async (id) => {
  const response = await RegisterModel.findById(id, {
    Username: 1,
    Followers: 1,
    Following: 1,
    Posts: 1,
    ProfilePicture: 1,
    _id: 0,
  });
  let FlattenedPost = [];
  if (response.Posts.length > 0) {
    FlattenedPost = FlattenPost(response.Posts, false);
  }
  const SerializedData = {
    Username: response.Username,
    Followers: response.Followers,
    Following: response.Following,
    Posts: FlattenedPost,
    ProfilePicture: response.ProfilePicture,
    Verified: false,
  };
  return SerializedData;
};

export const ProfilePostCollector = async (FlattenedPost, cache) => {
  let ReducedPosts = FlattenedPost;
  if (ReducedPosts.length > 6) {
    ReducedPosts = ReducedPosts.slice(0, 6);
  }
  const PostData = await GetPostDataHandler(cache, ReducedPosts);
  return PostData;
};


export const FollowingDataSearch = async (Following) => {
  const response = await RegisterModel.find(
    {
      _id: { $in: Following },
    },
    {
      Username: 1,
      Posts: 1,
      ProfilePicture: 1,
      _id: 0,
    }
  );
  const FollowingList = [];
  for (let post of response) {
    const posts = FlattenPost(post.Posts, true);
    const SerializedData = {
      Username: post.Username,
      Posts: posts,
      ProfilePicture: post.ProfilePicture,
    };
    FollowingList.push(SerializedData);
  }
  return FollowingList;
};