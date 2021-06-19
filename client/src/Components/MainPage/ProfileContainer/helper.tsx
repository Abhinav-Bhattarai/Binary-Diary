import Resizer from "react-image-file-resizer";
import { GetProfileDataProps } from "../interfaces";

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
      Posts: GetProfileData.Posts
    }
  }; 
  return SerializedData;
};