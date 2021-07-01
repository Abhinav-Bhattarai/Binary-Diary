export interface UserInfo {
  username: string;
  auth_token: string;
  userID: string;
  uid: string;
}

export interface PROPS {
  ChangeAuthentication: (type: boolean) => void;
}

export interface UserData {
  Following: Array<string>;
  Followers: Array<string>;
  LikedPosts: Array<string>;
  ProfilePicture: string;
  Posts: Array<string>;
  Username: string;
  FollowingList: Array<FollowingData>;
  __typename: string;
}

export interface POSTS {
  _id: string;
  Post: string;
  Caption: string;
  PostDate: string;
  CreatorID: string;
  Likes: Array<string>;
  CreatorUsername: string;
  ProfilePicture: string;
}

export interface FollowingData {
  Posts: Array<string>;
  Username: string;
  ProfilePicture: string;
};

export interface Suggestion {
  ProfilePicture: string;
  Username: string;
  error: boolean;
  id: string;
}

export interface RequestConfig {
  Username: string;
  ProfilePicture: string;
  extenderID: string;
}
