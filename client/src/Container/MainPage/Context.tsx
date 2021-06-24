import React from "react";
import { UserData, UserInfo } from "./interfaces";

export interface contextData {
  userInfo: UserInfo | null;
  ProfileData: UserData | null;
  ProfilePicture: string;
}

export const Context = React.createContext<contextData>({
  userInfo: null,
  ProfileData: null,
  ProfilePicture: "",
});
