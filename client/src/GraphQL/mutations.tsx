import { gql } from "@apollo/client";

export const AddPost = gql`
  mutation (
    $id: String!
    $Post: String!
    $Username: String!
    $Caption: String!
    $uid: String!
    $auth_token: String!
  ) {
    AddPost(
      id: $id
      uid: $uid
      Post: $Post
      Username: $Username
      Caption: $Caption
      auth_token: $auth_token
    ) {
      Mutated
    }
  }
`;

export const PostLikeMutation = gql`
  mutation (
    $id: String!
    $Username: String!
    $uid: String!
    $auth_token: String!
    $type: String!
    $PostID: String!
  ) {
    MutatePostLike(
      id: $id
      uid: $uid
      Username: $Username
      PostID: $PostID
      auth_token: $auth_token
      type: $type
    ) {
      Mutated
    }
  }
`;

export const FollowRequestMutations = gql`
  mutation (
    $id: String!
    $uid: String!
    $auth_token: String!
    $type: String!
    $RequesterID: String!
    username: String!
  ) {
    MutateFollowRequests(
      id: $id
      uid: $uid
      auth_token: $auth_token
      type: $type
      RequesterID: $RequesterID
      username: $username
    ) {
      Mutated
    }
  }
`;

export const RespondToRequest = gql`
  mutation (
    $id: String!
    $uid: String!
    $auth_token: String!
    $type: String!
    $RequesterID: String!
  ) {
    MutateRequestsResponse(
      id: $id
      uid: $uid
      auth_token: $auth_token
      type: $type
      RequesterID: $RequesterID
    ) {
      Mutated
    }
  }
`;

export const MutatePostComments = gql`
  mutation (
    $auth_token: String!
    $id: String!
    $uid: String!
    $PostID: String!
    $username: String!
    $Comment: String!
  ) {
    MutateComments(
      auth_token: $auth_token
      id: $id
      uid: $uid
      PostID: $PostID
      username: $username
      Comment: $Comment
    ) {
      Mutated
    }
  }
`;

export const MutateProfilePicture = gql`
  mutation (
    $auth_token: String!
    $id: String!
    $uid: String!
    $ProfilePicture: String!
  ) {
    MutateProfilePicture(
      auth_token: $auth_token
      id: $id
      uid: $uid
      ProfilePicture: $ProfilePicture
    ) {
      Mutated
    }
  }
`;
