export interface UserInfo {
    username: string;
    auth_token: string;
    userID: string;
    uid: string
};

export interface PROPS {
    ChangeAuthentication: (type: boolean) => void;
};

export interface UserData {
    Following: Array<string>;
    Followers: Array<string>;
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
    CreatorUsername: string;
};

export interface FollowingData {
    Posts: Array<string>;
    Username: string;
    ProfilePicture: string;
}