import { gql } from "@apollo/client";

export const FetchUserData = gql`
  query ($id: String!, $uid: String!) {
    GetUserData(id: $id, uid: $uid) {
      Username
      Followers
      Following
      ProfilePicture
      Posts
      FollowingList {
        Username
        ProfilePicture
        Following
        Followers
        Posts
      }
    }
  }
`;

export const PostsData = gql`
  query($auth_token: String!, $Posts: [String!], $id: String!, $request_count: Int!) {
    GetPostsData(auth_token: $auth_token, Posts: $Posts, id: $id, request_count: $request_count) {
      Post
      Caption
      PostDate
      CreatorID
      CreatorUsername
    }
  }
`;

export const PrePostData = gql`
  query($auth_token: String!, $id: String!){
    GetPrePostData(auth_token:$auth_token, id: $id) {
      Post
      Caption
      PostDate
      CreatorID
      CreatorUsername
    }
  }
`;