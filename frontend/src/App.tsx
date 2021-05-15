import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import {
  Switch,
  Route,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ExternalPacklist from "./components/ExternalPacklist";
import Home from "./components/Home";
import { useQuery } from "@apollo/client";
import { GET_USER_ITEMS } from "./graphql/queries";
import { UserItem, UserState } from "./types";
import LoggedIn from "./components/LoggedIn";

export interface UserItemResponse {
  getAuthorizedUser: {
    userItems: UserItem[];
  };
}

const App = () => {
  const [user, setUser] = useState<UserState>();
  // const [userItems, setUserItems] = useState<UserItem[]>();

  useEffect(() => {
    const userString = localStorage.getItem("packlister-user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const userItemsQuery = useQuery<UserItemResponse>(GET_USER_ITEMS);

  // useEffect(() => {
  //   setUserItems(userItemsQuery.data?.getAuthorizedUser.userItems);
  // }, [userItemsQuery.data]);

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem("packlister-user");
  };

  return (
    <Container>
      {user &&
        <div>
          <Switch>
            <Route path="/pack/:id">
              <ExternalPacklist />
            </Route>
            <Route path="/">
              <LoggedIn 
              logout={logout} 
              user={user} 
              userItemsQuery={userItemsQuery} 
              // setUserItems={setUserItems}
              />
            </Route>
          </Switch>
        </div>
      }
      {!user &&
        <div>
          <Switch>
            <Route path="/pack/:id">
              <ExternalPacklist />
            </Route>
            <Route path="/register">
              <RegisterForm />
            </Route>
            <Route path="/login">
              <LoginForm setUser={setUser} />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      }
    </Container>
  );
};

export default App;
