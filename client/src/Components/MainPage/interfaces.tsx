import React from "react";

export interface NavbarProps {
  value: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  HomePressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  SuggestionPressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  MessagesPressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  ProfilePressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
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
}

export interface GetProfileDataProps {
  Followers: Array<string> | null;
  Following: Array<string> | null;
  PostData: Array<PostListType>;
  Posts: Array<string>;
  ProfilePicture: string | null;
  Verified: boolean | null;
}

export interface SerializedProfile {
  ProfilePicture: string;
  ProfileData: {
    Following: string[] | null;
    Followers: string[] | null;
    Posts: string[];
  };
}