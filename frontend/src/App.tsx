import React, { useEffect, useState } from "react";
import { Container, createMuiTheme, ThemeProvider, useMediaQuery, CssBaseline, AppBar, makeStyles, Box } from "@material-ui/core";
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
import DarkModeToggle from "./components/DarkModeToggle";
import ChangePasswordForm from "./components/ChangePasswordForm";

export interface InitialStateResponse {
  getAuthorizedUser: {
    packlists: Packlist[];
    userItems: UserItem[];
  };
}

const useStyles = makeStyles(theme => ({
  bottomBar: {
    top: "auto",
    bottom: 0,
  },
}));

const App = () => {
  const [user, setUser] = useState<UserState>();
  const [darkMode, setDarkMode] = useState(useMediaQuery("(prefers-color-scheme: dark)"));
  const [currentPacklistId, setCurrentPacklistId] = useState<string>("");

  useEffect(() => {
    const userString = localStorage.getItem("packlister-user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const initialStateQuery = useQuery<InitialStateResponse>(GET_INITIAL_STATE, {
    skip: !user
  });

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem("packlister-user");
  };

  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        type: darkMode ? "dark" : "light",
      },
    }),
    [darkMode]
  );

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        {user &&
          <div>
            <Switch>
              <Route path="/pack/:id">
                <ExternalPacklist />
              </Route>
              <Route path="/change-password">
                <ChangePasswordForm />
              </Route>
              <Route path="/">
                <LoggedIn
                  logout={logout}
                  user={user}
                  initialStateQuery={initialStateQuery}
                  currentPacklistId={currentPacklistId}
                  setCurrentPacklistId={setCurrentPacklistId}
                />
              </Route>
            </Switch>
          </div>
        }
        {!user &&
          <>
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
            <AppBar position="fixed" color="primary" className={classes.bottomBar}>
              <Box margin={1}>Copyleft</Box>
            </AppBar>
          </>
        }
      </Container>
    </ThemeProvider>
  );
};

export default App;
