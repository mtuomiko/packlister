import React, { useEffect, useState } from 'react';
import { Button, Container } from '@material-ui/core';
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

import LoginForm from './components/LoginForm';
import RegisterForm from "./components/RegisterForm";
import ExternalPacklist from "./components/ExternalPacklist";

export interface UserState {
  token: string;
  id: string;
  username: string;
  email: string;
}

const App = () => {
  const [user, setUser] = useState<UserState>();

  useEffect(() => {
    const userString = localStorage.getItem('packlister-user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const logout = () => {
    setUser(undefined)
    localStorage.removeItem('packlister-user');
  }

  return (
    <Container>
      {user &&
        <div>
          <Switch>
            <Route path="/pack/:id">
              <ExternalPacklist />
            </Route>
            <Route path="/">
              <p>Can has login</p>
              <div>{user.id}</div>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <Button variant='outlined' onClick={logout}>Logout</Button>
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
              <Link to="/register">Register</Link>
              <Link to="login">Login</Link>
            </Route>
          </Switch>
        </div>
      }
    </Container>
  );
}

export default App;
