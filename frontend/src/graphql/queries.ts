import { gql } from "@apollo/client";
import { USER_ITEM_FIELDS } from "./fragments";

export const GET_INITIAL_STATE = gql`
  ${USER_ITEM_FIELDS}
  query getInitialState {
    getAuthorizedUser {
      id
      packlists {
        id
        name
        description
        categories {
          internalId
          name
          categoryItems {
            internalId
            userItemId
            quantity
          }
        }
      }
      userItems {
        ...UserItemFields
      }
    }
  }
`;
