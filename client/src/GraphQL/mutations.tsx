import { gql } from "@apollo/client";

export const AddPost = gql`
  mutation ($id: String!, $Post: String!, $Username: String!, $Caption: String!, $uid: String!) {
    AddPost(id: $id, uid: $uid, Post: $Post, Username: $Username, Caption: $Caption) {
        Mutated
    }
  }
`;