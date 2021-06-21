import { RegisterModel } from "../Models/register-model.js";
import dotenv from "dotenv";
import { PostModel } from "../Models/post-model.js";
import Crypto from 'crypto-js';
dotenv.config();

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
  };
  return FollowingList;
};

export function FlattenPost(posts, sort) {
  if (posts.length > 0) {
    const new_post = [];
    for (let post of posts) {
      if (sort === true) {
        const DAY = 60 * 60 * 24;
        const date_difference =
          (new Date() - new Date(post.CreationDate)) / 1000;
        if (date_difference <= DAY * 2) {
          new_post.push(post.PostID);
        }
      } else {
        new_post.push(post.PostID);
      }
    }
    return new_post;
  }
  return [];
}

export const GetUserDataCacheCheck = async (cache, id, uid) => {
  const UserData = await cache.get(`UserInfo/${id}/${uid}`);
  if (UserData !== null) {
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
      };
      await cache.set(`UserInfo/${id}/${uid}`, JSON.stringify(SerializedData));
      return SerializedData;
    }
    return null;
  }
  return null;
};

export const Decrypt = (Encryption) => {
  const bytes = Crypto.AES.decrypt(Encryption, process.env.ENCRYPT_TOKEN);
  const data = bytes.toString(Crypto.enc.Utf8);
  return JSON.parse(data);
};

export const Encrypt = (Encryption) => {
  const bytes = Crypto.AES.encrypt(JSON.stringify(Encryption), process.env.ENCRYPT_TOKEN).toString();
  return bytes;
}

export const GetPostDataHandler = async (cache, id, posts, request_count) => {
  const response = await PostModel.find({ _id: { $in: posts } });
  if (response.length > 0) {
    const SortedSerializedDataContainer = [];
    const UnSortedSerializedDataContainer = [];
    for (let data of response) {
      const SerializedData = {
        _id: data._id,
        Post: data.Post,
        Caption: data.Caption,
        PostDate: data.PostDate,
        CreatorID: data.CreatorID,
        CreatorUsername: data.CreatorUsername,
      };
      UnSortedSerializedDataContainer.push(SerializedData);
    };
    for (let i = UnSortedSerializedDataContainer.length - 1; i >= 0; i--) {
      SortedSerializedDataContainer.push(UnSortedSerializedDataContainer[i]);
    };
    if (request_count === 1 && cache && id) {
      const PrePostData = await cache.get(`PrePostData/${id}`);
      if (!PrePostData)
        await cache.set(`PrePostData/${id}`, JSON.stringify(SortedSerializedDataContainer));
    }
    return SortedSerializedDataContainer;
  }
  return [];
};

export const AddPostToDatabase = async ({ id, Username, Post, Caption }) => {
  const Data = new PostModel({
    CreatorID: id,
    CreatorUsername: Username,
    Post,
    Caption,
  });
  const response = await Data.save();
  return response;
};

export const AddPostID = async (user_id, post_id) => {
  const response = await RegisterModel.findOne({ _id: user_id });
  if (response) {
    response.Posts.push({ PostID: post_id });
    await response.save();
    return;
  }
};

export const ProfilePostCollector = async(FlattenedPost) => {
  let ReducedPosts = FlattenedPost;
  if (ReducedPosts.length > 6) {
    ReducedPosts = ReducedPosts.slice(0, 6);
  };
  const PostData = await GetPostDataHandler(null, null, ReducedPosts, -1);
  return PostData;
};

export const FetchUserData = async(id) => {
  const response = await RegisterModel.findById(id, {
    Username: 1,
    Followers: 1,
    Following: 1,
    Posts: 1,
    ProfilePicture: 1,
    _id: 0,
  });
  let FlattenedPost = []
  if (response.Posts.length > 0) {
    FlattenedPost = FlattenPost(response.Posts, false);
  }
  const SerializedData = {
    Username: response.Username,
    Followers: response.Followers,
    Following: response.Following,
    Posts: FlattenedPost,
    ProfilePicture: response.ProfilePicture
  }
  return SerializedData;
};