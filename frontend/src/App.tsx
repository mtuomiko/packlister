import React, { useEffect, useState } from 'react';

import LoginForm from './components/LoginForm';

const App = () => {
  const [token, setToken] = useState<string>('');
  
  useEffect(() => {
    const token = localStorage.getItem('packlister-user-token');
    if (token) {
      setToken(token);
    }
  }, []);

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
    </div>
  );
}

export default App;
