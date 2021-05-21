import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { REGISTER } from "../graphql/mutations";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

const useStyles = makeStyles(theme => {
  return {
    registerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    inputField: {
      margin: theme.spacing(1, 0),
    },
  };
});

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const history = useHistory();

  const [register, result] = useMutation<
    {
      createUser: {
        id: string;
      };
    },
    RegisterInput
  >(REGISTER, {
    onError: (error) => {
      if (error?.graphQLErrors) {
        console.error(error.graphQLErrors);
      } else {
        console.error(error.message);
      }
    }
  });

  useEffect(() => {
    if (result.data) {
      history.replace("/login");
    }
  }, [result.data, history]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    register({ variables: { username, email, password } });
  };

  const classes = useStyles();

  return (
    <Container className={classes.registerContainer}>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <form onSubmit={submit}>
        <TextField
          className={classes.inputField}
          required
          id="username"
          label="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          className={classes.inputField}
          required
          id="email"
          label="Email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          className={classes.inputField}
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
          color="primary"
          fullWidth
        >Register</Button>
      </form>
      {result.loading && <p>Loading</p>}
      {result.error && <p>Error</p>}
    </Container>
  );
};

export default RegisterForm;