import RegisterModel from "../Models/register-model.js";
import dotenv from "dotenv";
import PostModel from "../Models/post-model.js";
import Crypto from "crypto-js";
import RequestModel from "../Models/RequestModel.js";
import { CommentModel } from "../Models/comment-model.js";
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
  }
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
        if (date_difference <= DAY * 3) {
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

export const Decrypt = (Encryption) => {
  const bytes = Crypto.AES.decrypt(
    Encryption,
    process.env.ENCRYPT_TOKEN
  ).toString(Crypto.enc.Utf8);
  return JSON.parse(bytes);
};

export const Encrypt = (Encryption) => {
  const bytes = Crypto.AES.encrypt(
    JSON.stringify(Encryption),
    process.env.ENCRYPT_TOKEN
  ).toString();
  return bytes;
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

export const ProfilePostCollector = async (FlattenedPost, cache) => {
  let ReducedPosts = FlattenedPost;
  if (ReducedPosts.length > 6) {
    ReducedPosts = ReducedPosts.slice(0, 6);
  }
  const PostData = await GetPostDataHandler(cache, ReducedPosts);
  return PostData;
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

export const UpdateCacheUserInfo = async (cache, db_response, id, uid) => {
  const unserialized_data = await cache.get(`UserInfo/${id}/${uid}`);
  const serialized_data = JSON.parse(unserialized_data);
  serialized_data.Posts.push(db_response._id);
  await cache.set(`UserInfo/${id}/${uid}`, JSON.stringify(serialized_data));
};

export const RegisterLikeInPostSchema = async (userID, postID) => {
  const response = await PostModel.findOne({ _id: postID });
  if (response) {
    const dummy = [...response.Likes];
    dummy.push(userID);
    response.Likes = dummy;
    await response.save();
  }
};

export const RemoveLikeInPostSchema = async (userID, postID) => {
  const response = await PostModel.findOne({ _id: postID });
  if (response) {
    const dummy = [...response.Likes];
    for (let UserIdIndex in dummy) {
      if (dummy[UserIdIndex] === userID) {
        dummy.splice(UserIdIndex, 1);
        break;
      }
    }
    response.Likes = dummy;
    await response.save();
  }
};

export const RegisterLikeInRegisterSchema = async (userID, PostID) => {
  const response = await RegisterModel.findOne({ _id: userID });
  if (response) {
    const dummy = [...response.LikedPosts];
    dummy.push(PostID);
    response.LikedPosts = dummy;
    await response.save();
  }
};

export const RemoveLikeInRegisterSchema = async (userID, PostID) => {
  const response = await RegisterModel.findOne({ _id: userID });
  if (response) {
    const dummy = [...response.LikedPosts];
    for (let postIdIndex in dummy) {
      if (dummy[postIdIndex] === PostID) {
        dummy.splice(postIdIndex, 1);
        break;
      }
    }
    response.LikedPosts = dummy;
    await response.save();
  }
};

export const AddToUserCacheForLikedPosts = async (
  cache,
  userID,
  uid,
  PostID
) => {
  const UnserializedData = await cache.get(`UserInfo/${userID}/${uid}`);
  const SerializedData = JSON.parse(UnserializedData);
  SerializedData.LikedPosts.push(PostID);
  await cache.set(`UserInfo/${userID}/${uid}`, JSON.stringify(SerializedData));
  return;
};

export const RemoveUserCacheForLikedPosts = async (
  cache,
  userID,
  uid,
  PostID
) => {
  const UnserializedData = await cache.get(`UserInfo/${userID}/${uid}`);
  const SerializedData = JSON.parse(UnserializedData);
  for (let postID in SerializedData.LikedPosts) {
    if (SerializedData.LikedPosts[postID] === PostID) {
      SerializedData.LikedPosts.splice(postID, 1);
      break;
    }
  }
  await cache.set(`UserInfo/${userID}/${uid}`, JSON.stringify(SerializedData));
  return;
};

export const CreatePostCommentSchema = async () => {};

export const AddToFollowersListInCacheLayer = async (
  cache,
  myID,
  uid,
  newFollowerID
) => {
  const UnserializedData = await cache.get(`UserInfo/${myID}/${uid}`);
  const SerializedData = JSON.parse(UnserializedData);
  SerializedData.Followers.push(newFollowerID);
  await cache.set(`UserInfo/${myID}/${uid}`, JSON.stringify(SerializedData));
};

export const AddToFollowingListInCacheLayer = async (
  cache,
  myID,
  uid,
  newFollowingID
) => {
  const UnserializedData = await cache.get(`UserInfo/${myID}/${uid}`);
  const SerializedData = JSON.parse(UnserializedData);
  SerializedData.Following.push(newFollowingID);
  await cache.set(`UserInfo/${myID}/${uid}`, JSON.stringify(SerializedData));
};

export const AddToFollowersList = async (cache, RequesterID, id) => {
  const response = await RegisterModel.findOne({ _id: id });
  AddToFollowersListInCacheLayer(cache, id, response.UniqueID, RequesterID);
  response.Followers.push(RequesterID);
  await response.save();
};

export const AddToFollowingList = async (cache, RequesterID, myID) => {
  const response = await RegisterModel.findOne({ _id: RequesterID });
  AddToFollowingListInCacheLayer(cache, RequesterID, response.UniqueID, myID);
  response.Following.push(myID);
  await response.save();
};

export const RemoveFromFollowersList = async (id, RequesterID) => {
  const response = await RegisterModel.findOne({ _id: id });
  const dummy = [...response.Followers];
  for (let follower in dummy) {
    if (dummy[follower] === RequesterID) {
      dummy.splice(follower, 1);
      break;
    }
  }
  response.Followers = dummy;
  await response.save();
};

export const RemoveFromFollowingList = async (RequesterID, myID) => {
  const response = await RegisterModel.findOne({ _id: RequesterID });
  const dummy = [...response.Following];
  for (let follower in dummy) {
    if (dummy[follower] === myID) {
      dummy.splice(follower, 1);
      break;
    }
  }
  response.Following = dummy;
  await response.save();
};

export const AddToRequestsList = async (id, ReceiverID, ReceiverUsername) => {
  const response = await RequestModel.findOne({ UserID: ReceiverID });
  const dummy = [...response.Requests];
  dummy.push({ extenderID: id, Username: ReceiverUsername });
  response.Requests = dummy;
  await response.save();
};

export const RemoveFromRequestsList = async (id, ReceiverID) => {
  const response = await RequestModel.findOne({ UserID: ReceiverID });
  const dummy = [...response.Requests];
  for (let id_ in dummy) {
    if (dummy[id_].extenderID === id) {
      dummy.splice(id_, 1);
      break;
    }
  }
  response.Requests = dummy;
  await response.save();
};

export const AddToRequestedList = async (ReceiverID, id) => {
  const response = await RegisterModel.findOne({ _id: id });
  const dummy = [...response.Requested];
  dummy.push(ReceiverID);
  response.Requested = dummy;
  await response.save();
};

export const RemoveFromRequestedList = async (ReceiverID, id) => {
  const response = await RegisterModel.findOne({ _id: id });
  const dummy = [...response.Requested];
  for (let id_ in dummy) {
    if (dummy[id_] === ReceiverID) {
      dummy.splice(id_, 1);
      break;
    }
  }
  response.Requested = dummy;
  await response.save();
};

export const UpdateRequestList = async (id, RequesterID) => {
  RemoveFromRequestedList(id, RequesterID);
  RemoveFromRequestsList(RequesterID, id);
};

const SerializeComments = async (cache, arr) => {
  const SerializedData = []
  for (let comment of arr) {
    const ProfilePicture = await cache.get(`ProfilePicture/${comment.CommenterID}`);
    comment.ProfilePicture = ProfilePicture ? ProfilePicture : '';
    SerializedData.push(comment);
  };
  return SerializedData;
}

export const GetPostComments = async (PostID, requestCount, cache) => {
  const response = await CommentModel.find({PostID: PostID}).skip(requestCount * 10).limit(requestCount);
  console.log(response);
  if (response.length > 0) {
    const SerializedResponse = await SerializeComments(cache, response);
    return SerializedResponse.reverse();
  }
  return response;
};

export const AddNewComment = async (config) => {
  const response = new CommentModel(config);
  await response.save();
}

export const AddProfilePictureToPpCacheLayer = async(cache, ProfilePicture, id) => {
  await cache.set(`ProfilePicture/${id}`, ProfilePicture);
}

export const AddProfilePictureToUserInfoCacheLayer = async(cache, ProfilePicture, id, uid) => {
  const UnserializedData = await cache.get(`UserInfo/${id}/${uid}`);
  const SerializedData = JSON.parse(UnserializedData);
  SerializedData.ProfilePicture = ProfilePicture;
  await cache.set(`UserInfo/${id}/${uid}`, JSON.stringify(SerializedData));
}

export const AddProfilePictureToDB = async(ProfilePicture, id) => {
  const response = await RegisterModel.findOne({_id: id});
  response.ProfilePicture = ProfilePicture;
  await response.save();
}

// export const RemoveComments = async () => {};