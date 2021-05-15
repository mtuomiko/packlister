import { Button, IconButton, TextField } from "@material-ui/core";
import React from "react";
import { nanoid } from "nanoid";
import { Delete } from "@material-ui/icons";

import { UserItem, UserState } from "../types";

interface LoggedInProps {
  logout: () => void;
  user: UserState | undefined;
  userItems: UserItem[] | undefined;
  setUserItems: React.Dispatch<React.SetStateAction<UserItem[] | undefined>>;
}

const LoggedIn = ({ logout, user, userItems, setUserItems }: LoggedInProps) => {
  if (!user || !userItems) {
    return null;
  }
  console.log(userItems);
  const addUserItem = () => {
    const newItem: UserItem = {
      internalId: nanoid(),
      name: "",
      description: "",
      weight: 0,
    };
    setUserItems(userItems.concat(newItem));
  };

  const removeUserItem = (id: string) => {
    setUserItems(userItems.filter(item => item.internalId !== id));
  };

  return (
    <>
      <div>{user.id}</div>
      <div>{user.username}</div>
      <div>{user.email}</div>
      <Button variant='outlined' onClick={logout}>Logout</Button>
      <div>
        {userItems.map(item => (
          <div key={item.internalId}>
            <TextField defaultValue={item.name} />
            <TextField defaultValue={item.description} />
            <TextField defaultValue={item.weight} />
            <IconButton aria-label="delete" onClick={() => removeUserItem(item.internalId)}>
              <Delete />
            </IconButton>
          </div>
        ))}
      </div>
      <div>
        <Button variant="outlined" onClick={addUserItem}>Add</Button>
      </div>
    </>
  );
};

export default LoggedIn;