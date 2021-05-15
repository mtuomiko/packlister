import { gql } from "@apollo/client";
import { USER_ITEM_FIELDS } from "./fragments";

// export const GET_USER_DATA = gql`
//   ${USER_ITEM_FIELDS}
//   query getUserData {
//     getAuthorizedUser {
//       packlists {
//         id
//         name
//         description
//         categories {
//           internalId
//           name
//           categoryItems {
//             userItemId
//             quantity
//           }
//         }
//       }
//       userItems {
//         ...UserItemFields
//       }
//     }
//   }
// `;

export const GET_USER_ITEMS = gql`
  ${USER_ITEM_FIELDS}
  query getUserItems {
    getAuthorizedUser {
      userItems {
        ...UserItemFields
      }
    }
  }
`;