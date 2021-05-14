import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { LOGIN } from '../graphql/mutations';

interface LoginInput {
  username: string;
  password: string;
}

const LoginForm = ({ setToken }: {
  setToken: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [login, result] = useMutation<
    {
      login: {
        value: string,
      },
    },
    LoginInput
  >(LOGIN, {
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
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('packlister-user-token', token)
    }
  }, [result.data, setToken])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <TextField
          required
          id="username"
          label="Username"
          value={username}
          variant="outlined"
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          value={password}
          variant="outlined"
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button variant="outlined" type="submit">Login</Button>
      </form>
    </div>
  );
}

export default LoginForm