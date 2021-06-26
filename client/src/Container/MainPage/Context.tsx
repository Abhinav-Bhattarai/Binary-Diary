import { UserData, UserInfo } from "./interfaces";
export interface contextData {
  userInfo: UserInfo | null;
  ProfileData: UserData | null;
  ProfilePicture: string;
}