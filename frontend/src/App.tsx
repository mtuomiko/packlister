import React, { useEffect, useState } from 'react';
import { Button, Container } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LoginForm from './components/LoginForm';
import RegisterForm from "./components/RegisterForm"

const App = () => {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('packlister-user-token');
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken('')
    localStorage.removeItem('packlister-user-token');
  }

  return (
    <Router>
      <Container>
        {token &&
          <>
            <p>Can has login</p>
            <Button variant='outlined' onClick={logout}>Logout</Button>
          </>
        }
        {!token &&
          <div>
            <Switch>
              <Route path="/register">
                <RegisterForm />
              </Route>
              <Route path="/login">
                <LoginForm setToken={setToken} />
              </Route>
              <Route path="/">
                <Link to="/register">Register</Link>
                <Link to="login">Login</Link>
              </Route>
            </Switch>
          </div>
        }
      </Container>
    </Router>

  );
}

export default App;
