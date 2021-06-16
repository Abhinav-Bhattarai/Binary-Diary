import Resizer from "react-image-file-resizer";
import { GetProfileDataProps } from "../interfaces";

export const resizeFile = async (file: Blob) => {
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        400,
        400,
        "JPEG",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        300,
        300
      );
    });
  };

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
}