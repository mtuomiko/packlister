import { gql } from "@apollo/client";

export const USER_ITEM_FIELDS = gql`
  fragment UserItemFields on UserItem {
    internalId
    name
    description
    weight
  }
`;