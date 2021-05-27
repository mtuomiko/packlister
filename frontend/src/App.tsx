import React, { useState } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Route, Switch } from "react-router-dom";
import { userStorageVar } from "./cache";
import { createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery, unstable_createMuiStrictModeTheme } from "@material-ui/core";
import { Packlist, UserItem } from "./types";
import { GET_INITIAL_STATE } from "./graphql/queries";
import Home from "./components/Home";
import ChangePasswordForm from "./components/ChangePasswordForm";
import ExternalPacklist from "./components/ExternalPacklist";
import LoggedIn from "./components/LoggedIn";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import NotLoggedIn from "./components/NotLoggedIn";

export interface InitialStateResponse {
  getAuthorizedUser: {
    id: string;
    username: string;
    email: string;
    packlists: Packlist[];
    userItems: UserItem[];
  };
}

const App = () => {
  const user = useReactiveVar(userStorageVar);
  const [darkMode, setDarkMode] = useState(useMediaQuery("(prefers-color-scheme: dark)"));

  const initialStateQuery = useQuery<InitialStateResponse>(GET_INITIAL_STATE, {
    skip: !user?.token,
  });

  // Material UI v4 transitions use findDOMNode which is deprecated in StrictMode
  // Using unstable createMui allows StrictMode usage in development without warnings 
  const createTheme = process.env.NODE_ENV === "production" ? createMuiTheme : unstable_createMuiStrictModeTheme;
  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        type: darkMode ? "dark" : "light",
      },
    }),
    [darkMode, createTheme]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        {user?.token &&
          <>
            <Switch>
              <Route path="/pack/:id">
                <ExternalPacklist />
              </Route>
              <Route path="/change-password">
                <ChangePasswordForm />
              </Route>
              <Route path="/">
                <LoggedIn
                  initialStateQuery={initialStateQuery}
                />
              </Route>
            </Switch>
          </>
        }
        {!user?.token &&
          <>
            <Switch>
              <Route path="/pack/:id">
                <ExternalPacklist />
              </Route>
              <Route path="/register">
                <RegisterForm />
              </Route>
              <Route path="/login">
                <LoginForm />
              </Route>
              <Route path="/">
                {!user?.noLogin && <Home />}
                {user?.noLogin && <NotLoggedIn />}
              </Route>
            </Switch>
          </>
        }
      </>
    </ThemeProvider>
  );
};

export default App;
