import React from "react";
import { UserInfo } from "../../Container/MainPage/interfaces";

export interface NavbarProps {
  value: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  HomePressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  SuggestionPressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  MessagesPressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  ProfilePressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  ProfilePicture: string | undefined;
  Username: string | undefined;
  Blur: () => void;
  reference: React.RefObject<HTMLDivElement>
}

export interface ProfileAreaProps {
  Username: string | undefined;
  source: string | undefined;
}
export interface SearchBarProps {
  value: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: string;
  type: "text" | "password" | "email";
  Blur: () => void;
}

export interface LogoProps {
  source: string;
  width: string;
  height: string;
}

export interface PostListType {
  Post: string;
  _id: string;
  CreatorUsername: string;
  CreatorID: string;
  Caption: string;
  Likes: Array<string>;
}

export interface ProfilePostDetailsType {
  Post: string;
  id: string;
  CreatorUsername: string;
  CreatorID: string;
  Caption: string;
  Likes: Array<string>;
  LikeStatus: boolean;
  UserInfo: UserInfo | null;
  ProfilePicture: string;
  RevertPopup?: () => void;
  ChangeLikedPosts?: (type: boolean, id: string) => void;
}

export interface GetProfileDataProps {
  Username: string;
  Followers: Array<string> | null;
  Following: Array<string> | null;
  PostData: Array<PostListType>;
  Posts: Array<string>;
  ProfilePicture: string | null;
  Verified: boolean | null;
  FetchLimit: boolean;
  Error: null | boolean;
}

export interface SerializedProfile {
  ProfilePicture: string;
  ProfileData: {
    Following: string[] | null;
    Followers: string[] | null;
    Posts: string[];
    Username: string;
  };
}

export interface PROFILESTATEBTN { 
  name: 'Follow' | 'Following' | 'Requested' | 'Loading';
  RequesterID: string | undefined;
  userInfo: UserInfo | null  
  RequesterUsername: string | undefined;
  SendSocketRequest: (id: string | undefined) => void;
}