import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { LOGIN } from "../graphql/mutations";
import { UserState } from "../types";

interface LoginInput {
  username: string;
  password: string;
}

const useStyles = makeStyles({
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const LoginForm = ({ setUser }: {
  setUser: React.Dispatch<React.SetStateAction<UserState | undefined>>;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [login, result] = useMutation<
    {
      login: {
        token: string;
        user: {
          id: string;
          username: string;
          email: string;
        };
      };
    },
    LoginInput
  >(LOGIN, {
    onError: (error) => {
      if (error?.graphQLErrors[0]?.message) {
        console.error(error?.graphQLErrors[0]?.message);
      } else {
        console.error(error.message);
      }
    }
  });

  useEffect(() => {
    if (result.data) {
      const { token, user } = result.data.login;
      const userState = { token, ...user };
      setUser(userState);
      localStorage.setItem("packlister-user", JSON.stringify(token));
    }
  }, [result.data, setUser]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  const classes = useStyles();

  return (
    <Container className={classes.loginContainer}>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <form onSubmit={submit}>
        <TextField
          required
          id="username"
          label="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          variant="outlined"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
        >Log in</Button>
      </form>
    </Container>
  );
};

export default LoginForm;