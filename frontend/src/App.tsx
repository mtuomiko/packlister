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
import { GET_INITIAL_STATE } from "./graphql/queries";
import { Packlist, UserItem, UserState } from "./types";
import LoggedIn from "./components/LoggedIn";

export interface InitialStateResponse {
  getAuthorizedUser: {
    packlists: Packlist[];
    userItems: UserItem[];
  };
}

const App = () => {
  const [user, setUser] = useState<UserState>();
  // const [userItems, setUserItems] = useState<UserItem[]>();
  const [currentPacklistId, setCurrentPacklistId] = useState<string>("");
  //const [packlists, setPacklists] = useState<Packlist[]>();

  useEffect(() => {
    const userString = localStorage.getItem("packlister-user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const initialStateQuery = useQuery<InitialStateResponse>(GET_INITIAL_STATE, {
    skip: !user
  });

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
                initialStateQuery={initialStateQuery}
                currentPacklistId={currentPacklistId}
                setCurrentPacklistId={setCurrentPacklistId}
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
