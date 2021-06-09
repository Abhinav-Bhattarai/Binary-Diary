export interface UserInfo {
    username: string;
    auth_token: string;
    userID: string;
};

export interface PROPS {
    ChangeAuthentication: (type: boolean) => void;
};

export interface POSTS {
    Post: string;
    Caption: string;
    PostDate: string;
    CreatorID: string;
    CreatorUsername: string;
}