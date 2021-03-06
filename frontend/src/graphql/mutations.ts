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

export const UPDATE_STATE = gql`
  mutation updateState($userItems: [UserItemInput!]!, $packlists: [PacklistInput!]!) {
    updateState(userItems: $userItems, packlists: $packlists) {
      success
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(passwords: {
      oldPassword: $oldPassword,
      newPassword: $newPassword,
    }) {
      id
    }
  }
`;

export const CREATE_PACKLIST = gql`
  mutation createPacklist($name: String!) {
    createPacklist(input: {
      name: $name
    }) {
      id
    }
  }
`;