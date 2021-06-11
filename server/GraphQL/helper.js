import { RegisterModel } from "../Models/register-model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PostModel } from "../Models/post-model.js";
dotenv.config();

export const FollowingDataSearch = async (Following) => {
  const response = await RegisterModel.find(
    {
      _id: { $in: Following },
    },
    {
      Username: 1,
      Followers: 1,
      Following: 1,
      Bio: 1,
      Posts: 1,
      ProfilePicture: 1,
      _id: 0,
    }
  );
  return response;
};

export const GetUserDataCacheCheck = async (cache, id, uid) => {
  const UserData = await cache.get(`UserInfo/${id}/${uid}`);
  if (UserData) return JSON.parse(UserData);
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
      let SerializedData = {
        Username: response.Username,
        Followers: response.Followers,
        Following: response.Following,
        Bio: response.Bio,
        Posts: response.Posts,
        ProfilePicture: response.ProfilePicture,
      };
      await cache.set(`UserInfo/${id}/${uid}`, JSON.stringify(SerializedData));
      return SerializedData;
    }
    return null;
  }
  return null;
};

export const GetPostDataHandler = async(cache, id, posts, request_count) => {
  const response = await PostModel.find({ _id: { $in: posts } }).sort({
    date: -1,
  });
  if (response.length > 0) {
    const SerializedData = {
      Post: response.Post,
      Caption: response.Caption,
      PostDate: response.PostDate,
      CreatorID: response.CreatorID,
      CreatorUsername: response.CreatorUsername,
    };
    const PrePostData = await cache.get(`PrePostData/${id}`);
    if (!PrePostData && request_count === 1) {
      await cache.set(
        `PrePostData/${id}`,
        JSON.stringify(SerializedData)
      );
    }
    return SerializedData;
  }
  return null
};

export const AddPostToDatabase = async ({ id, Username, Post, Caption }) => {
  const Data = new PostModel({
    CreatorID: id,
    CreatorUsername: Username,
    Post,
    Caption
  });
  const response = await Data.save();
  return response;
}

export const CheckJWT = async(token) => {
    const data = jwt.verify(token, process.env.JWT_AUTH_TOKEN);
    return data;
};
