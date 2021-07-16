import RegisterModel from "../Models/register-model.js";
import dotenv from "dotenv";
import PostModel from "../Models/post-model.js";
import Crypto from "crypto-js";
import RequestModel from "../Models/RequestModel.js";
import { CommentModel } from "../Models/comment-model.js";
dotenv.config();

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

export const AddToRequestedListCacheLayer = async (cache, ReceiverID, id, uid) => {
  const UnserializedData = await cache.get(`UserInfo/${id}/${uid}`);
  const SerializedData = JSON.parse(UnserializedData);
  SerializedData.Requested.push(ReceiverID)
  await cache.set(`UserInfo/${id}/${uid}`, JSON.stringify(SerializedData));
}

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

export const RemoveFromRequestedListCache = async(cache, ReceiverID, id, uid) => {
  const UnserializedData = await cache.get(`UserInfo/${id}/${uid}`);
  const SerializedData = JSON.parse(UnserializedData);
  for (let id_ in SerializedData.Requested) {
    if (SerializedData.Requested[id_] === ReceiverID) {
      SerializedData.Requested.splice(id_, 1);
      break;
    }
  };
  await cache.set(`UserInfo/${id}/${uid}`, JSON.stringify(SerializedData));
}

export const UpdateRequestList = async (id, RequesterID) => {
  RemoveFromRequestedList(id, RequesterID);
  RemoveFromRequestsList(RequesterID, id);
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