import { gql } from "@apollo/client";

export const FetchUserData = gql`
  query ($id: String!, $uid: String!) {
    GetUserData(id: $id, uid: $uid) {
      Username
      Followers
      Following
    }
  }
`;
