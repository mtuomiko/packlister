import React from "react";

import { UserState } from "../types";
import { OperationVariables, QueryResult } from "@apollo/client";
import { UserItemResponse } from "../App";
import UserItemsForm from "./UserItemsForm";
import { Button } from "@material-ui/core";

interface LoggedInProps {
  logout: () => void;
  user: UserState | undefined;
  userItemsQuery: QueryResult<UserItemResponse, OperationVariables>;
  // setUserItems: React.Dispatch<React.SetStateAction<UserItem[] | undefined>>;
}

const LoggedIn = ({ logout, user, userItemsQuery }: LoggedInProps) => {
  if (!user || userItemsQuery.loading || userItemsQuery.error) {
    return null;
  }
  const userItems = userItemsQuery.data?.getAuthorizedUser.userItems || [];
  console.log(userItems);

  // const addUserItem = () => {
  //   const newItem: UserItem = {
  //     internalId: nanoid(),
  //     name: "",
  //     description: "",
  //     weight: 0,
  //   };
  //   setUserItems(userItems.concat(newItem));
  // };

  // const removeUserItem = (id: string) => {
  //   setUserItems(userItems.filter(item => item.internalId !== id));
  // };

  return (
    <>
      <div>{user.id}</div>
      <div>{user.username}</div>
      <div>{user.email}</div>
      <UserItemsForm userItems={userItems} />
      <Button onClick={logout}>Logout</Button>
    </>
  );
};

export default LoggedIn;