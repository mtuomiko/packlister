import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/mutations'

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
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default LoginForm