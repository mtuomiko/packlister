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