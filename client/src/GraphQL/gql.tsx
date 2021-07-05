import { gql } from "@apollo/client";

export const FetchUserData = gql`
  query ($id: String!, $uid: String!, $auth_token: String!) {
    GetUserData(id: $id, uid: $uid, auth_token: $auth_token) {
      Username
      Followers
      Following
      ProfilePicture
      Posts
      LikedPosts
      FollowingList {
        Username
        ProfilePicture
        Posts
      }
    }
  }
`;

export const PostsData = gql`
  query ($auth_token: String!, $Posts: [String!], $id: String!, $uid: String!) {
    GetPostsData(auth_token: $auth_token, Posts: $Posts, id: $id, uid: $uid) {
      _id
      Post
      Caption
      PostDate
      CreatorID
      CreatorUsername
      ProfilePicture
      Likes
    }
  }
`;

export const ProfileDataFetch = gql`
  query (
    $auth_token: String!
    $id: String!
    $uid: String!
    $searchID: String!
    $verify: Boolean!
    $Posts: [String]
  ) {
    GetProfileData(
      auth_token: $auth_token
      id: $id
      uid: $uid
      searchID: $searchID
      verify: $verify
      Posts: $Posts
    ) {
      Username
      Followers
      Following
      Posts
      ProfilePicture
      Verified
      PostData {
        _id
        Post
        CreatorUsername
        CreatorID
        Caption
        PostDate
        Likes
      }
    }
  }
`;

export const FetchMoreProfilePosts = gql`
  query ($auth_token: String!, $id: String!, $uid: String!, $Posts: [String]) {
    GetMoreProfilePosts(
      auth_token: $auth_token
      id: $id
      uid: $uid
      Posts: $Posts
    ) {
      PostData {
        _id
        Post
        CreatorUsername
        CreatorID
        Caption
        PostDate
      }
    }
  }
`;

export const FetchProfileRequests = gql`
  query ($auth_token: String!, $id: String!, $uid: String!) {
    GetProfileRequests(
      auth_token: $auth_token
      id: $id
      uid: $uid
    ) {
      Requests {
        Username
        extenderID
        ProfilePicture
      }
    }
  }
`;
