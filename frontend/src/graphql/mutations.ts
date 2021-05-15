import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(credentials: {
      username: $username,
      password: $password
    }) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    createUser(input: {
      username: $username,
      email: $email,
      password: $password
    }) {
      id
    }
  }
`;

export const UPDATE_USERITEMS = gql`
  mutation updateUserItems($userItems: [UserItemInput!]!) {
    updateState(userItems: $userItems) {
      success
    }
  }
`;