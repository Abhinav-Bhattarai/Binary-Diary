import Resizer from "react-image-file-resizer";
import { GetProfileDataProps, PostListType } from "../interfaces";

export const resizeFile = (file: Blob) =>
  new Promise((resolve) => {
  Resizer.imageFileResizer(
    file,
    550,
    550,
    "JPEG",
    80,
    0,
    (uri) => {
      resolve(uri);
    },
    "base64"
  );
});

export const SerializeProfileData = (GetProfileData: GetProfileDataProps, DefaultProfile: string) => {
  let ProfilePicture = DefaultProfile;
  if (GetProfileData.ProfilePicture) {
    if (GetProfileData.ProfilePicture.length > 0) {
      ProfilePicture = GetProfileData.ProfilePicture;
    }
  } 
  const SerializedData = {
    ProfilePicture,
    ProfileData: {
      Following: GetProfileData.Following,
      Followers: GetProfileData.Followers,
      Posts: GetProfileData.Posts,
      Username: GetProfileData.Username
    }
  }; 
  return SerializedData;
};

export const SerializeNewPosts = (PostData: Array<PostListType>, post_list: Array<PostListType> | null) => {
  let serialized_post_list = PostData;
  if (!PostData) return [];
  if (post_list && PostData.length > 0) {
    serialized_post_list = [...post_list];
    for (let post of PostData) {
      serialized_post_list.push(post);
    }
  }
  return serialized_post_list;
};

export const DetermineFetchLimit = (postArray: Array<string> | undefined, requestCount: number) => {
  if (postArray) {
    const SplicedArray = postArray.slice(requestCount * 6, (requestCount * 6) + requestCount + 2);
    if (SplicedArray.length < 7) {
      return true
    }
    return false
  };
  return false;
};

export const GetNewSlicedProfileData = (DummyPost: Array<string>, requestCount: number) => {
  let last_index = DummyPost.length;
  if (DummyPost.length - 1 > (requestCount + 1) * 6) {
    last_index = (requestCount + 1) * 6;
  }
  DummyPost = DummyPost.slice(requestCount * 6, last_index);
  return DummyPost;
}
