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

export const MutatePostLike = gql`
  mutation(
    $id: String!
    $Username: String!
    $uid: String!
    $auth_token: String!
    $type: String!
    $PostID: String!
  ) {
    MutatePostLike (
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
