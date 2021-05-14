import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

import LoginForm from './components/LoginForm';

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

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    );
  }

  return (
    <div>
      <p>Can has login</p>
      <Button variant='outlined' onClick={logout}>Logout</Button>
    </div>
  );
}

export default App;
