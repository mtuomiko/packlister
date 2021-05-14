import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(input: {
      username: $username,
      password: $password
    }) {
      value
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