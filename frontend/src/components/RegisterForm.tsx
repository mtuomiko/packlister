import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Container, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import { REGISTER } from '../graphql/mutations';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

const useStyles = makeStyles({
  registerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const RegisterForm = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const history = useHistory();

  const [register, result] = useMutation<
    {
      register: {
        id: string,
      },
    },
    RegisterInput
  >(REGISTER, {
    onError: (error) => {
      if (error?.graphQLErrors[0]?.message) {
        console.error(error?.graphQLErrors[0]?.message)
      } else {
        console.error(error.message)
      }
    }
  })

  useEffect(() => {
    if (result.data) {
      history.replace("/login");
    }
  }, [result.data, history]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    register({ variables: { username, email, password } })
  }

  const classes = useStyles();

  return (
    <Container className={classes.registerContainer}>
      <Typography component="h1" variant="h5">
        Register
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
          id="email"
          label="Email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
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
        >Register</Button>
      </form>
    </Container>
  );
}

export default RegisterForm