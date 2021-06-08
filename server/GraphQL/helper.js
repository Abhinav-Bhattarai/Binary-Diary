import { RegisterModel } from "../Models/register-model.js";

export const FollowingDataSearch = async (cache, Following, Username) => {
  const DummyData = await cache.get(`FollowingInfo/${Username}`);
  if (DummyData) {
    const CacheData = JSON.parse(DummyData);
    if (CacheData.length > 0) {
      return CacheData;
    }
    return null;
  } else {
    if (Following.length > 0) {
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
      await cache.set(`FollowingInfo/${Username}`, JSON.stringify(response));
      if (response.length > 0) {
        return response;
      }
      return null;
    }
  }
};

export const GetUserDataCacheCheck = async (cache, id, uid) => {
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
  const UserData = await cache.get(`UserInfo/${id}/${uid}`);
  if (UserData) return JSON.parse(UserData);
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
