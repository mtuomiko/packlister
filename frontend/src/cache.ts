import { InMemoryCache, makeVar } from "@apollo/client";
import { UserState } from "./types";

// export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem("packlister-user"));

// TODO: Runtime typing
const readUserStorage = () => {
  const userString = localStorage.getItem("packlister-user");
  if (userString) {
    const user = JSON.parse(userString) as UserState;
    return user;
  }
  return null;
};

// export const userStorage = makeVar(localStorage.getItem("packlister-user"));
export const userStorageVar = makeVar(readUserStorage());

export const cache: InMemoryCache = new InMemoryCache(
  // {
  //   typePolicies: {
  //     Query: {
  //       fields: {
  //         isLoggedIn: {
  //           // read(isLoggedIn = !!localStorage.getItem("packlister-user")) {
  //           read() {
  //             return isLoggedInVar();
  //           }
  //         },
  //       },
  //     },
  //   },
  // }
);
