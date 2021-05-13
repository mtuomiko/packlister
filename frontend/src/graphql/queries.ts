import { gql } from '@apollo/client';
import { USER_ITEM_FIELDS } from './fragments'

export const GET_AUTHORIZED_USER = gql`
  ${USER_ITEM_FIELDS}
  query getAuthorizedUser{
    getAuthorizedUser {
      id
      username
      email
      packlists {
        id
        name
        description
        categories {
          internalId
          name
          categoryItems {
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
`